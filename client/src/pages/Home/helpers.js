import { unique } from "../../utils/index.js";

export const getCompetitions = async (bettingContract) =>
  await bettingContract.contract.methods
    .getCompetitions()
    .call()

export const getGames = async (bettingContract, competitionId) =>
  await bettingContract.methods
    .getGames(competitionId)
    .call()

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

export const subscibeToEvents = (bettingContract) => {
  bettingContract.events
    .NewBet()
    .on("connected", function () {
      console.log("subscribe to NewBet event");
    })
    .on("data", function (data) {
      console.log(data);
    })
    .on("error", function (error) {
      console.log(error);
    });
};
