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

module.exports = async function (deployer, network, accounts) {
  const owner = selectedAddress;
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
