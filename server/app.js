const express = require("express");
const cors = require("cors");
const Web3 = require('web3');
const { CONFIG } = require("./config");
const cron = require('node-cron');
const { oracle_contract_address } = require('./config/index.json')
const { OracleContract } = require('./services/index.js');
const { Db } = require("./db/index.js");
const { fetchNewCompetitionsAndWriteToDb, fetchNewGamesAndWriteToDb } = require('./services/SportsMonkApi.js')
const web3 = new Web3('ws://localhost:8545');
// instantiation of contract
const oracleContract = new OracleContract(web3, oracle_contract_address);
// subscribe to NewRequest event generated by cron task in order to settle games
oracleContract.subscribeAndSettle();

// init express server
const app = express();
// cors configuration middleware
app.use(cors(CONFIG.CORS));

// get all competitions
app.get('/competitions', async (req, res) => {
  try {
    let db = new Db("competitions");
    const competitions = await db.findElement({}, 0, 100);
    res.status(200).json(competitions)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error"
    })
  }
});

// get games for a given competitions id 
app.get('/competitions/:id/games', async (req, res) => {
  try {
    const { id } = req.params;
    let db = new Db("games");
    const games = await db.findElement({ league_id: parseInt(id) }, 0, 100);
    res.status(200).json(games)

  } catch (error) {
    console.log(error);
    res.status(500).json(games)
  }

});

// get games by id
app.get('/games/:id', async (req, res) => {

  try {
    const { id } = req.params;
    let db = new Db("games");
    const games = await db.findElement({ id: id }, 0, 1);
    if (games.length > 0) {
      res.status(200).json(games[0])
    } else {
      res.status(404).json({
        message: "Page not found",
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(games)
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


// scheduled task to fetch data for new competitions and games on SportsMonk API and write it to database for admin dashboard every hours
// cron.schedule('24 * * * *', async () => {
//   try {
//     console.log('Starting fetching new competitions and writing to database ...')
//     const competitions = await fetchNewCompetitionsAndWriteToDb();
//     console.log('competitions task completed with success ...')
//     console.log('Starting fetching new games and writing to database ...');
//     console.log(competitions)
//     await fetchNewGamesAndWriteToDb(competitions);
//     console.log('games task completed with success ...')
//   } catch (error) {
//     console.log(error)
//   }
// }, {
//   scheduled: true,
//   timezone: "Europe/Paris"
// })

//scheduled task to fetch data on BettingContract compare it to SportMonk API game status and send an request to create a secured blueprint for request in order to settle games 
cron.schedule('1 * * * *', async () => {
  try {
    oracleContract.checkGameEndedAndCreateRequest();
  } catch (error) {
    console.log('ERROR: UNABLE TO CREATE ORACLE REQUEST')
    console.log(error)
  }
});






