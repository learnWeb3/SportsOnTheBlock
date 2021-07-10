const fs = require("fs");
const { CONFIG } = require("../config/index.js");
const Oracle = artifacts.require("Oracle");

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

const competition = {
  competitionId: 1,
  name: "eurocup",
  description: "lorem ipsum dolor sit amet",
  cover: "/competitions/1",
};

const games = [
  {
    gameId: 16475286,
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "switzerland",
    team2Name: "spain",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/1.png",
  },
  {
    gameId: 16475287,
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "belgium",
    team2Name: "italia",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/2.png",
  },
  {
    gameId: 16475288,
    competitionId: 1,
    start: parseInt((Date.now() + 3600 * 24 * 1000).toString().slice(0, -3)),
    team1Name: "italie",
    team2Name: "espagne",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/3.png",
  },
  {
    gameId: 16475289,
    competitionId: 1,
    start: (Date.now() + 3600 * 24 * 1000).toString().slice(0, -3),
    team1Name: "tcheck rep",
    team2Name: "danmeark",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/4.png",
  },
];

const createGames = async (oracle, owner, games) =>
  await Promise.all(
    games.map(
      async ({
        gameId,
        competitionId,
        start,
        team1Name,
        team2Name,
        description,
        cover,
      }) => {
        await oracle.newGame(
          gameId,
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
  await deployer.deploy(Oracle);
  const oracle = await Oracle.deployed();
  await oracle.deployBettingContract();
  // const { name, description, cover, competitionId } = competition;
  // await oracle.newCompetition(competitionId, name, description, cover, {
  //   from: owner,
  // });
  // await createGames(oracle, owner, games);
  const betting_contract_address = await oracle.bettingContractAddress();

  // write client configurations
  fs.writeFileSync(
    process.cwd() + "/client/src/config/index.json",
    JSON.stringify({
      api_token: CONFIG.api_token,
      betting_contract_address,
      oracle_contract_address: oracle.address,
      provider_url:
        network === "development"
          ? CONFIG.development.provider_url
          : CONFIG.production.provider_url,
      server_root_path:
        network === "development"
          ? CONFIG.development.server_root_path
          : CONFIG.production.server_root_path,
    })
  );

  // write server configurations

  fs.writeFileSync(
    process.cwd() + "/server/config/index.json",
    JSON.stringify({
      api_token: CONFIG.api_token,
      betting_contract_address,
      oracle_contract_address: oracle.address,
      provider_url:
        network === "development"
          ? CONFIG.development.provider_url
          : CONFIG.production.provider_url,
    })
  );

  // export contract ABIs
  exportContractABIS();
};
