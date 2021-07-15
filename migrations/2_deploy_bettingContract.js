require("dotenv").config();
const fs = require("fs");
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
  const owner = accounts[0];
  await deployer.deploy(Oracle);
  const oracle = await Oracle.deployed();
  await oracle.deployBettingContract();
  const betting_contract_address = await oracle.bettingContractAddress();

  // write client configurations
  fs.writeFileSync(
    process.cwd() + "/client/src/config/index.json",
    JSON.stringify({
      api_token: process.env.api_token,
      betting_contract_address,
      oracle_contract_address: oracle.address,
      provider_url:
        network === "development"
          ? process.env.dev_provider_url
          : process.env.prod_provider_url,
      server_root_path:
        network === "development"
          ? process.env.dev_server_root_path
          : process.env.prod_server_root_path,
    })
  );

  // write server configurations
  fs.writeFileSync(
    process.cwd() + "/server/config/index.json",
    JSON.stringify({
      api_token: process.env.api_token,
      betting_contract_address,
      oracle_contract_address: oracle.address,
      provider_url:
        network === "development"
          ? process.env.development_provider_url
          : process.env.prod_provider_url,
    })
  );

  // export contract ABIs
  exportContractABIS();
};
