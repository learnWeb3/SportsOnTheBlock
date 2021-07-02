const fs = require("fs");
const { CONFIG } = require("../config/index.js");
const BettingContract = artifacts.require("BettingContract");

const exportContractABIS = () => {
  const contractsABIPaths = fs.readdirSync(process.cwd() + "/build/contracts");
  contractsABIPaths.map((contractABIFileName) => {
    const contractABI = fs.readFileSync(
      process.cwd() + `/build/contracts/${contractABIFileName}`
    );
    fs.writeFileSync(
      process.cwd() + `/client/src/services/contracts/${contractABIFileName}`,
      contractABI
    );
  });
};

const games = [
  {
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "switzerland",
    team2Name: "spain",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/1.png",
  },
  {
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "belgium",
    team2Name: "italia",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/2.png",
  },
  {
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "italie",
    team2Name: "espagne",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/3.png",
  },
  {
    competitionId: 1,
    start: (Date.now() + 3600 * 24 * 1000).toString().slice(0, -3),
    team1Name: "tcheck rep",
    team2Name: "danmeark",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/4.png",
  },
];

const createGames = async (bettingContract, owner, games) =>
  await Promise.all(
    games.map(
      async ({
        competitionId,
        start,
        team1Name,
        team2Name,
        description,
        cover,
      }) => {
        await bettingContract.newGame(
          competitionId,
          start,
          team1Name,
          team2Name,
          description,
          cover,
          { from: owner }
        );
      }
    )
  );

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  await deployer.deploy(BettingContract);
  const bettingContract = await BettingContract.deployed();
  const competition = {
    name: "eurocup",
    description: "lorem ipsum dolor sit amet",
    cover: "/competitions/1",
  };
  const { name, description, cover } = competition;
  await bettingContract.newCompetition(name, description, cover, {
    from: owner,
  });

  await createGames(bettingContract, owner, games);

  // write client configurations
  fs.writeFileSync(
    process.cwd() + "/client/src/config/index.json",
    JSON.stringify({
      provider_url:
        network === "development"
          ? CONFIG.development.provider_url
          : CONFIG.production.provider_url,
      initial_contract_address: bettingContract.address,
      server_root_path:
        network === "development"
          ? CONFIG.development.server_root_path
          : CONFIG.production.server_root_path,
    })
  );
  // export contract ABIs
  exportContractABIS();
};
