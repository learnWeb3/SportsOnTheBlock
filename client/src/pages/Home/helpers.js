import { unique } from "../../utils/index.js";
import { fetchData } from "../Admin/helpers";

export const getCompetitions = async (bettingContract) => {
  const dbCompetitions = await fetchData("/competitions");
  const contractCompetitions = await bettingContract.contract.methods
    .getCompetitions()
    .call()
    .then((competitionsIds) =>
      competitionsIds.map((competitionId) => parseInt(competitionId))
    );
  return dbCompetitions.filter((competition) =>
    contractCompetitions.includes(competition.id)
  );
};

export const getGames = async (
  bettingContract,
  competitionId,
  dbGames,
  isFilterGameToActive
) => {
  const gameIds = await bettingContract.methods
    .getGames(competitionId)
    .call()
    .then((gamesIds) => gamesIds.map((id) => parseInt(id)));
  return await Promise.all(
    gameIds.map(
      async (gameId) => await bettingContract.methods.getGame(gameId).call()
    )
  ).then((games) => {
    return games
      .map((game) => {
        const dbGame = dbGames.find(
          (dbgame) => parseInt(dbgame.id) === parseInt(game.id)
        );
        return {
          ...game,
          ...dbGame,
          ended: game.ended,
          started: game.started,
          id: parseInt(game.id),
        };
      })
      .filter((game) => game.ended !== isFilterGameToActive);
  });
};

export const getBets = async (bettingContract, games) =>
  await Promise.all(
    games.map(async (game) => {
      let bets = await bettingContract.methods.getBets(game.id).call();
      bets = bets.map(({ amount, outcome, user }) => ({
        amount,
        outcome,
        user,
      }));
      let uniqueUsers = unique(bets.map((bet) => bet.user));
      let betsValue = bets.reduce(
        (prev, next) => prev + parseInt(next.amount),
        0
      );
      return {
        gameId: game.id,
        bets,
        betsCount: bets.length,
        betsValue,
        uniqueUsers,
        uniqueUserCount: uniqueUsers.length,
      };
    })
  );

export const makeStats = (bets, bettingContract, games, competitions) => {
  let transactionCount,
    uniqueAddressCount,
    avgTransactionCountPerAddress,
    avgGamePerCompetition,
    totalFunds,
    gamesCount,
    competitionCount;

  transactionCount = bets.reduce((prev, next) => prev + next.bets.length, 0);
  uniqueAddressCount = unique(bets.map((game) => game.uniqueUsers)).length;
  avgTransactionCountPerAddress = Math.ceil(
    transactionCount / uniqueAddressCount
  );
  avgGamePerCompetition = Math.ceil(games.length / competitions.length);
  totalFunds = bettingContract.utils
    .fromWei(`${bets.reduce((prev, next) => prev + next.betsValue, 0)}`)
    .slice(0, 4);
  gamesCount = games.length;
  competitionCount = competitions.length;
  return {
    transactionCount,
    uniqueAddressCount,
    avgTransactionCountPerAddress,
    avgGamePerCompetition,
    totalFunds,
    gamesCount,
    competitionCount,
  };
};

const subscribeToNewBet = (bettingContract, refreshBets) => {
  bettingContract.events
    .NewBet()
    .on("connected", function () {
      console.log("subscribe to NewBet event");
    })
    .on("data", function (data) {
      refreshBets(parseInt(data.returnValues[1]));
    })
    .on("error", function (error) {
      subscribeToNewBet();
    });
};

const subscribeToNewGame = (bettingContract, refreshGames) => {
  bettingContract.events
    .NewGame()
    .on("connected", function () {
      console.log("subscribe to NewGame event");
    })
    .on("data", function (data) {
      refreshGames();
    })
    .on("error", function (error) {
      subscribeToNewGame();
    });
};
const subscribeToNewCompetition = (bettingContract, refreshCompetitions) => {
  bettingContract.events
    .NewCompetition()
    .on("connected", function () {
      console.log("subscribe to NewCompetition event");
    })
    .on("data", function (data) {
      refreshCompetitions();
    })
    .on("error", function (error) {
      subscribeToNewCompetition();
    });
};

const subscribeToGamesStatus = (bettingContract, refreshGames) => {
  bettingContract.events
    .GameStarted()
    .on("connected", function () {
      console.log("subscribe to GameStarted event");
    })
    .on("data", function (data) {
      refreshGames();
    })
    .on("error", function (error) {
      subscribeToGamesStatus();
    });

  bettingContract.events
    .GameEnded()
    .on("connected", function () {
      console.log("subscribe to GameEnded event");
    })
    .on("data", function (data) {
      refreshGames();
    })
    .on("error", function (error) {
      subscribeToGamesStatus();
    });
};

export const subscribeToEvents = (
  _bettingContract,
  refreshGames,
  refreshCompetitions,
  refreshBets
) => {
  subscribeToNewCompetition(_bettingContract, refreshCompetitions);
  subscribeToNewGame(_bettingContract, refreshGames);
  subscribeToGamesStatus(_bettingContract, refreshGames);
  subscribeToNewBet(_bettingContract, refreshBets);
};
