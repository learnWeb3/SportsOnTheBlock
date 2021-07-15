const Oracle = artifacts.require("Oracle");
const BettingContract = artifacts.require("BettingContract");
const Utils = require("web3-utils");
const assert = require("chai").assert;
const expect = require("chai").expect;

contract("Oracle", async (accounts) => {
  const owner = accounts[0];
  const userAccount = accounts[1];
  let oracle, bettingContract;
  it("should deploy bettingContract", async () => {
    oracle = await Oracle.deployed();
    const tx = await oracle.deployBettingContract({ from: owner });
    assert.notProperty(tx, "error", "betting contract deployed with success");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successfull");
  });
  it("should not create a competition directly from BettingContract", async () => {
    oracle = await Oracle.deployed();
    const bettingContractAddress = await oracle.bettingContractAddress();
    bettingContract = await BettingContract.at(bettingContractAddress);
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
    oracle = await Oracle.deployed();
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
    oracle = await Oracle.deployed();
    const tx = await oracle.newCompetition(1, { from: owner });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successfull");
  });

  it("should not create a game as user is not owner", async () => {
    oracle = await Oracle.deployed();
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
    oracle = await Oracle.deployed();
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
    oracle = await Oracle.deployed();
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
      await bettingContract.bet(0, 3);
      assert.fail();
    } catch (error) {
      expect(error.stack, "VM exception thrown").to.match(
        /VM Exception while processing transaction: revert/g
      );
    }
  });

  it("should place a new bet if game exists", async () => {
    const tx = await bettingContract.bet(1, 0, { from: userAccount });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
  });

  it("should place a new bet if game exists", async () => {
    const tx = await bettingContract.bet(1, 1, { from: userAccount });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
  });

  it("should place a new bet if game exists", async () => {
    const tx = await bettingContract.bet(1, 2, { from: userAccount });
    assert.notProperty(tx, "error", "tx successFull");
    assert.hasAllKeys(tx, ["logs", "receipt", "tx"], "transaction successful");
    assert.exists(tx.logs[0], "event fired with success");
    assert.equal(tx.logs[0].event, "NewBet");
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
});
