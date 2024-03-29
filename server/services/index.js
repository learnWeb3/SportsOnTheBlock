const fetch = require("node-fetch");
const { betting_contract_address } = require("../config/index.json");
const { abi: oracleContractAbi } = require("../../build/contracts/Oracle.json");

const {
  abi: bettingContractAbi,
} = require("../../build/contracts/BettingContract.json");

const { api_token } = require("../config/index.json");

const {
  CONFIG: { GAS },
} = require("../config/index.js");

class Contract {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
  }

  _setContract() {
    const { eth, utils } = this.provider;
    eth.Contract.setProvider(this.provider);
    this._contract = new eth.Contract(this._abi, this.address);
    this._contract.utils = utils;
    this._contract.options.gasPrice = "20000000000000"; // default gas price in wei
    this._contract.options.gas = 150000;
  }

  get contract() {
    return this._contract;
  }
}

class BettingContract extends Contract {
  constructor(provider, address) {
    super(provider, address);
    this._abi = bettingContractAbi;
    this._setContract();
  }

  async _getSettlementData() {
    // map through bettingContract competitions
    const self = this;
    const competitionsIds = await this.contract.methods
      .getCompetitions()
      .call();
    // map through bettingContract games and retrieve games on api according to id
    const gamesData = [];
    await Promise.all(
      competitionsIds.map(
        async (competitionId) =>
          await self.contract.methods
            .getGames(parseInt(competitionId))
            .call()
            .then(async (gamesIds) =>
              Promise.all(
                gamesIds.map(
                  async (gameId) =>
                    await self.contract.methods.getGame(gameId).call()
                )
              )
            )
            .then((games) => games.filter((game) => !game.ended))
            .then((games) =>
              Promise.all(
                games.map(async (game) => {
                  const url = `https://soccer.sportmonks.com/api/v2.0/fixtures/${game.id}?api_token=${api_token}`;
                  const response = await fetch(url);
                  const { data, error } = await response.json();
                  !error && gamesData.push(data);
                })
              )
            )
      )
    );
    // return games from api call
    return gamesData;
  }
}

class OracleContract extends Contract {
  constructor(provider, address) {
    super(provider, address);
    this._abi = oracleContractAbi;
    this._setContract();
    this.bettingContract = new BettingContract(
      provider,
      betting_contract_address
    );
  }

  async activeCompetitions() {
    const activeCompetitionsIds = await this.bettingContract.contract.methods
      .getCompetitions()
      .call()
      .then((_activeCompetitionsIds) =>
        _activeCompetitionsIds.map((activeCompetitionId) =>
          parseInt(activeCompetitionId)
        )
      );

    return activeCompetitionsIds;
  }

  subscribeAndSettle() {
    const self = this;
    this.contract.events
      .NewRequest({}, function (error, event) {
        //console.log(event);
      })
      .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
      })
      .on("data", async function (event) {
        // access Request struct fields
        const { rootUrl, endpoint, id, paramsToFetch } = event.returnValues[0];
        //construct provable full url from struct fields
        const url = rootUrl + endpoint + id + "?api_token=" + api_token;
        //console.log(url));
        // fetch url
        const response = await fetch(url);
        // access response data
        const { data } = await response.json();
        if (data) {
          // spliting provable parameters to fetch
          const params = paramsToFetch.split(",");
          // retriving provable parameters to fetch from Oracle in api response
          let localTeamScore, visitorTeamScore, gameStatus;
          localTeamScore = params[0].split(".");
          localTeamScore = parseInt(data[localTeamScore[0]][localTeamScore[1]]);
          visitorTeamScore = params[1].split(".");
          visitorTeamScore = parseInt(
            data[visitorTeamScore[0]][visitorTeamScore[1]]
          );
          gameStatus = params[2].split(".");
          gameStatus = data[gameStatus[0]][gameStatus[1]];
          // accessing admin localaccounts
          const accounts = await self.provider.eth.getAccounts();
          // setting up owner account to first one
          const owner = accounts[0];
          const tx = await self.contract.methods
            .updateRequest(
              parseInt(id),
              parseInt(localTeamScore),
              parseInt(visitorTeamScore),
              gameStatus
            )
            .send({ from: owner, gas: GAS });
          console.log(tx);
        }
      })
      .on("error", function (error) {
        console.log(error);
        this.subscribeAndSettle();
      });
  }

  async checkGameEndedAndCreateRequest() {
    // accessing admin localaccounts
    const accounts = await this.provider.eth.getAccounts();
    // setting up owner account to first one
    const owner = accounts[0];
    // accepted games status
    const finished_status = ["FT", "FT_PEN", "AET"];
    // getGames data on sportMonk API
    const gamesData = await this.bettingContract._getSettlementData();
    // filter to keep the one which have ended
    if (gamesData.length > 0) {
      const gamesToSettle = gamesData;
      //   .filter((game) =>
      //     finished_status.includes(game.time.status)
      //   );
      // check wether games have ended and create request on oracle
      if (owner && gamesToSettle.length > 0) {
        await Promise.all(
          gamesToSettle.map(async (gameToSettle) => {
            const tx = await this.contract.methods
              .createRequest(gameToSettle.id)
              .send({ from: owner, gas: GAS });
          })
        );
      }
    }
  }
}

module.exports = { OracleContract };
