import { sum } from "../../utils";

const format = (betValue, bettingContract) => {
  if (betValue > 0) {
    return bettingContract.utils.fromWei(`${betValue}`);
  } else {
    return "0.00";
  }
};

export const getBets = async (bettingContract, gameId) =>
  await bettingContract.methods
    .getBets(gameId)
    .call()
    .then((bets) =>
      bets.map(({ amount, outcome, user }) => ({
        amount,
        outcome,
        user,
      }))
    )
    .then((bets) => ({
      team1Bets: bets.filter((bet) => bet.outcome === "1"),
      team2Bets: bets.filter((bet) => bet.outcome === "2"),
      drawBets: bets.filter((bet) => bet.outcome === "0"),
      bets,
    }))
    .then(({ team1Bets, team2Bets, drawBets, bets }) => ({
      bets,
      betStats: {
        team1BetsValue: format(
          team1Bets.length > 0 ? sum(team1Bets) : 0,
          bettingContract
        ).slice(0, 4),
        team2BetsValue: format(
          team2Bets.length > 0 ? sum(team2Bets) : 0,
          bettingContract
        ).slice(0, 4),
        drawBetsValue: format(
          drawBets.length > 0 ? sum(drawBets) : 0,
          bettingContract
        ).slice(0, 4),
      },
    }));

export const getUserGains = async (
  gameId,
  winnerBetsSum,
  loserBetsSum,
  bettingContract
) => {
  const userInitialDepositWei = await bettingContract.methods
    .getUserInitialBetSum(gameId)
    .call();
  const userProfitsWei =
    (((parseInt(userInitialDepositWei) * 100) / parseInt(winnerBetsSum)) *
      parseInt(loserBetsSum)) /
    100;
  return parseInt(userInitialDepositWei) + userProfitsWei;
};
