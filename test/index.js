const Oracle = artifacts.require("Oracle");
const BettingContract = artifacts.require("BettingContract");
const BigNumber = require("bignumber.js");
const chai = require("chai");
//use default BigNumber
chai.use(require("chai-bignumber")());
const assert = require("chai").assert;
const expect = require("chai").expect;

contract("Oracle", async (accounts) => {
  const owner = selectedAddress;
  const userAccount = accounts[1];
  let oracle, bettingContract;
  it("should deploy bettingContract", async () => {
    oracle = await Oracle.deployed();
    const tx = await oracle.deployBettingContract({ from: owner });
    const bettingContractAddress = await oracle.bettingContractAddress();
    bettingContract = await BettingContract.at(bettingContractAddress);
    assert.notProperty(tx, "error", "betting contract deployed with success");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successfull");
    assert.exists(bettingContractAddress, "betting contract address exists");
  });
  it("should not create a competition directly from BettingContract", async () => {
    try {
      await bettingContract.newCompetition(1, { from: userAccount });
      await bettingContract.newCompetition(1, { from: owner });
      assert.fail("competitions not created");
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });
  it("should not create a competition as user is not owner", async () => {
    try {
      await oracle.newCompetition(1, { from: userAccount });
      assert.fail("competition not created");
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });
  it("should create a new competitition as user is owner", async function () {
    const tx = await oracle.newCompetition(1, { from: owner });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successfull");
  });

  it("should not create a game as user is not owner", async () => {
    try {
      await oracle.newGame(1, 1, 1, { from: userAccount });
      assert.fail();
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should not create a game as competition does not exists", async () => {
    try {
      await oracle.newGame(1, 0, 1, { from: userAccount });
      assert.fail();
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should create a game", async () => {
    const tx = await oracle.newGame(1, 1, 1, { from: owner });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successfull");
  });

  it("should throw an error if the game does not esists", async () => {
    try {
      await bettingContract.bet(0, 0);
      assert.fail();
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should throw an error if the outcome is invalid", async () => {
    try {
      await bettingContract.bet(1, 3);
      assert.fail();
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should place a new bet if game exists and outcome is 0", async () => {
    const tx = await bettingContract.bet(1, 0, {
      from: userAccount,
      value: 10000000000000000000,
    });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
  });

  it("should get the correct bet amount according to user bets sent to contract outcome 0", async () => {
    const actual = await bettingContract.getUserInitialBetSum(1, 0, {
      from: userAccount,
    });
    expect(new BigNumber(actual)).to.be.bignumber.equal("10000000000000000000");
  });

  it("should place a new bet if game exists and outcome is 1", async () => {
    const tx = await bettingContract.bet(1, 1, {
      from: userAccount,
      value: 10000000000000000000,
    });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
  });

  it("should get the correct bet amount according to user bets sent to contract outcome 1", async () => {
    const actual = await bettingContract.getUserInitialBetSum(1, 1, {
      from: userAccount,
    });
    expect(new BigNumber(actual)).to.be.bignumber.equal("10000000000000000000");
  });

  it("should place a new bet if game exists and outcome is 2", async () => {
    const tx = await bettingContract.bet(1, 2, {
      from: userAccount,
      value: 10000000000000000000,
    });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
  });

  it("should get the correct bet amount according to user bets sent to contract outcome 2", async () => {
    const actual = await bettingContract.getUserInitialBetSum(1, 2, {
      from: userAccount,
    });
    expect(new BigNumber(actual)).to.be.bignumber.equal("10000000000000000000");
  });

  it("should return all the competitions ids", async function () {
    const ids = await bettingContract.getCompetitions();
    assert.isArray(ids, "competitions returned with success");
    assert.equal(ids.length, 1, "competition ids returned with success");
  });

  it("should return all the games ids", async function () {
    const ids = await bettingContract.getGames(1);
    assert.isArray(ids, "games ids returned with success");
    assert.equal(ids.length, 1, "game ids returned with success");
  });

  it("should return a game", async function () {
    const game = await bettingContract.getGame(1);
    assert.isArray(game, "game returned with success");
    assert.hasAnyKeys(
      game,
      [
        "ended",
        "exists",
        "id",
        "loserBetsSum",
        "start",
        "started",
        "team1Score",
        "team2Score",
        "winner",
        "winnerBetsSum",
      ],
      "Game has all the correct keys"
    );
  });

  it("should get the current bets for a given game", async () => {
    const bets = await bettingContract.getBets(1);
    assert.isArray(bets, "bets returned with success");
    assert.equal(bets.length, 3, "correct number of bet returned");
    assert.hasAnyKeys(
      bets[0],
      ["user", "amount", "outcome"],
      "A Bet has all the correct keys"
    );
  });

  it("should throw an error calling claimProfits before the game has ended", async () => {
    try {
      await bettingContract.claimProfits(1, { from: userAccount });
      assert.fail("claim has failed");
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should settle the game if user is owner", async () => {
    let tx = await oracle.createRequest(1, { from: owner });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.equal(tx.logs.length, 1, "event present on the logs");
    assert.equal(
      tx.logs[0].event,
      "NewRequest",
      "NewRequest event succesfully emitted"
    );

    tx = await oracle.updateRequest(1, 0, 0);
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");

    const game = await bettingContract.getGame(1);
    assert.equal(game.ended, true, "game property ended is true");
    assert.equal(game.started, true, "game property started is true");
    expect(new BigNumber(game.team1Score)).to.be.bignumber.equal("0");
    expect(new BigNumber(game.team2Score)).to.be.bignumber.equal("0");
    expect(
      new BigNumber(game.winner),
      "correct game winner"
    ).to.be.bignumber.equal("0");
    const userWinningBetSum = await bettingContract.getUserWinnerBetSum(1, {
      from: userAccount,
    });
    expect(new BigNumber(userWinningBetSum)).to.be.bignumber.equal(
      "10000000000000000000"
    );
  });

  it("should send gains to user after claim if game has ended", async () => {
    const initialBalance = await web3.eth.getBalance(userAccount);
    const tx = await bettingContract.claimProfits(1, { from: userAccount });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    const afterClaimBalance = await web3.eth.getBalance(userAccount);
    expect(parseInt(afterClaimBalance)).to.be.greaterThan(
      parseInt(initialBalance)
    );
  });
});
