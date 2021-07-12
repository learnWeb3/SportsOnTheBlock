const express = require("express");
const cors = require("cors");
const Web3 = require("web3");
const { CONFIG } = require("./config");
const cron = require("node-cron");
const { oracle_contract_address } = require("./config/index.json");
const { OracleContract } = require("./services/index.js");
const { Db } = require("./db/index.js");
const {
  fetchNewCompetitionsAndWriteToDb,
  fetchNewGamesAndWriteToDb,
  updateGamesStatus,
} = require("./services/SportsMonkApi.js");
const web3 = new Web3("ws://localhost:8545");
// instantiation of contract
const oracleContract = new OracleContract(web3, oracle_contract_address);
// subscribe to NewRequest event generated by cron task in order to settle games
oracleContract.subscribeAndSettle();

// init express server
const app = express();
// cors configuration middleware
app.use(cors(CONFIG.CORS));

// get all competitions
app.get("/competitions", async (req, res) => {
  try {
    let db = new Db("competitions");
    const competitions = await db.findElement({}, 0, 100);
    res.status(200).json(competitions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
});

// get games for a given competitions id
app.get("/competitions/:id/games", async (req, res) => {
  try {
    const { id } = req.params;
    let db = new Db("games");
    const games = await db.findElement({ league_id: parseInt(id) }, 0, 100);
    res.status(200).json(games);
  } catch (error) {
    console.log(error);
    res.status(500).json(games);
  }
});

// get games by id
app.get("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let db = new Db("games");
    const games = await db.findElement({ id: id }, 0, 1);
    if (games.length > 0) {
      res.status(200).json(games[0]);
    } else {
      res.status(404).json({
        message: "Page not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(games);
  }
});

// match allroutes not taken in charge by the api
app.all("*", async (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

// lauch server
app.listen(CONFIG.SERVER_PORT, async () =>
  console.log(`server running on port ${CONFIG.SERVER_PORT}`)
);

// scheduled task to fetch data for new competitions on SportsMonk API and write it to database for admin dashboard every day before noon
cron.schedule(
  "59 23 * * *",
  async () => {
    try {
      console.log(
        "Starting fetch new competitions and writing to database ..."
      );
      await fetchNewCompetitionsAndWriteToDb();
      console.log("competitions added with success to database ...");
    } catch (error) {
      // console.log(error);
      console.log(
        "Error when when fetching new competitions and writing to database"
      );
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Paris",
  }
);

// scheduled task to fetch data for new games on SportsMonk API and write it to database for admin dashboard every day before noon
cron.schedule("59 23 * * *", async () => {
  try {
    const activeCompetitions = await oracleContract.activeCompetitions();
    console.log("Starting fetch new games and writing to database ...");
    await fetchNewGamesAndWriteToDb(activeCompetitions);
    console.log("games added with success");
  } catch (error) {
    console.log("Error when fetching new games and inserting in database");
  }
});

// scheduled task to fetch data for new games on SportsMonk API and write it to database for admin dashboard every day before noon
cron.schedule("59 23 * * *", async () => {
  try {
    console.log("Started bulk update of database games status ....");
    await updateGamesStatus();
    console.log("database games status updated");
  } catch (error) {
    console.log("Error when updating games status");
  }
});

// scheduled task to fetch data on BettingContract compare it to SportMonk API game status
// and send an request to create a secured blueprint for request in order to settle games
// every hours settlement
cron.schedule("27 * * * *", async () => {
  try {
    oracleContract.checkGameEndedAndCreateRequest();
  } catch (error) {
    console.log("ERROR: UNABLE TO CREATE ORACLE REQUEST");
    console.log(error);
  }
});
