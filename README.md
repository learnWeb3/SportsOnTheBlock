# SportsOnTheBlock: A blockchain betting game service (dev-only)

The application is structured around a client and a server communicating via REST API developped using Node js express.

The exposed endpoints are the following :

- /competitions
- /competitions/:id/games

The server talks to the MongoDb collections containing the current competitions and games and automatically updates them on MongoDB Atlas, it also settles and updates status of the games present on the deployed instance of the Betting contract using cron tasks.

- every days before midnight cron task fetches new games and competitions which does not already exists in the database
- every days before midnight cron task updates games status in database
- every hours cron task settles the games in the Betting smart contract through a trusted call (fetch url constructed on chain by the Oracle contract) to the Sports Monk API.

As a source of data we use SportsMonks API in order to offer new games and competitions.
We have a free tier plan active on the data provider platform wich limits call number to 180/H;

As a proff of our good faith we offer you the ability to verify the data provided for the game settlement process by calling the requests(uint256 gameId) function on the Oracle smart contract

### Critics

We currently rely on only one data provider wich is a major flaw (single point of failure) in terms of decentralization and make the contract vulnerable as it is heavely dependent on the data provided by SportsMonk API.

### Warnings

Improvements need to be done in order for this project to be live. Please have a look to the related section

The auto setlement of the games is initiated by the checkGameEndedAndCreateRequest() function present in the following file:

```bash
code ./server/services/index.js
```

As a proof of concept the game status check is commented out so all the games added to the contract sohould be settled in the following hour.

### Quickstart

#### Dependencies

```bash
# install all packages
npm run dependencies
```

```bash
# install packages
npm i
```

```bash
# install server packages
cd ./server && npm i
```

```bash
# install client packages
cd ./client && npm i
```

### Lauch the smart contract test

```bash
# install client packages
npm run contract-test
```

#### Running the app (dev only)

```bash
# lauch ganache
ganache-cli
```

```bash
# migrate the contract using ganache instance (port: 8545)
npm run truffle-dev
```

```bash
# lauch the dev server
npm run dev-server
```

```bash
# lauch the dev client
npm run dev-client
```

### Internal Configurations and environnement variables

You need to create two .env files referencing the following variables

dev_provider_url="ws://localhost:8545"
dev_server_root_path="http://localhost:8000"
prod_provider_url="https://ropsten.infura.io/v3/4c45f4cc5b5b450e8a17ddae01994d56"
prod_server_root_path= "http://localhost:8000"
mnemonic="<<YOUR METAMASK MNEMONIC>>"
api_token="<<YOUR SPORT MONK API TOKEN>>"

```bash
# root directory
touch .env
# migrations folder
touch /migrations/.env
```

Configurations are then exported to client and server subfolder as json files providing them live contracts address :

```bash
#server generated configuration file
cd server/config/index.json
#client generated configuration file
cd client/src/config/index.json
```

Server subfolder have it's own configuration files in order to interact with a mongodb database:

```bash
#server configuration file mainly for database interaction
cd server/config/index.js
```

### Administration

In order to access the admin panel to add new games and competitions to the betting contract you will need to add a new account in your metamask wallet using the private keys from the account used on the contract deployment.
Please have a look to the migrations files if you want to mess around.

### Improvements

1. Smart contracts unit tests:

To do :

- [x] Test Betting functions
- [x] Test Oracle functions
- [] Test server functions
- [] Test client functions

2. Gas fees:

- [] Gas limits provided for contract call needs to be refined
- [] Deploy contracts on Optimism network (layer 2)

3. Metamask interactions

- [x] Setup metamask to interact with the application

### Development environment

- Truffle: v5.3.13 (core: 5.3.13)
- Solidity: 0.8.0 (solc-js)
- Node: v10.19.0
- Web3.js: v1.3.6
- Mongodb Atlas

2. **Truffle v5.X.X** - A development framework for Ethereum.

```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```

2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.

3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.
