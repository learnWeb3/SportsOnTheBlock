const fs = require("fs");
const { exec } = require("child_process");
const MNEMONIC =
  "surge furnace seek amazing abuse crop orbit slow congress volcano buzz arm";
const ropsten_provider_url =
  "https://ropsten.infura.io/v3/4c45f4cc5b5b450e8a17ddae01994d56";
const development_provider_url = "http://localhost:7545";

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
    team1Name: "italie",
    team2Name: "france",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/1",
  },
  {
    competitionId: 1,
    team1Name: "italie",
    team2Name: "allemagne",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/2",
  },
  {
    competitionId: 1,
    team1Name: "italie",
    team2Name: "espagne",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/3",
  },
  {
    competitionId: 1,
    team1Name: "potugal",
    team2Name: "espagne",
    description: "lorem ipsum dolor sit amet",
    cover: "/games/3",
  },
];

const createGames = async (bettingContract, owner, games) =>
  await Promise.all(
    games.map(
      async ({ competitionId, team1Name, team2Name, description, cover }) => {
        await bettingContract.newGame(
          competitionId,
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

  // check network type and set provider url
  let provider_url;
  if (network === "development") {
    provider_url = development_provider_url;
  } else if (network === "ropsten") {
    provider_url === ropsten_provider_url;
  }
  // write client configurations
  fs.writeFileSync(
    process.cwd() + "/client/src/config/index.json",
    JSON.stringify({
      provider_url: provider_url,
      initial_contract_address: bettingContract.address,
    })
  );
  // export contract ABIs
  exportContractABIS();
};
