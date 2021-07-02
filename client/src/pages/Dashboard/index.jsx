import React, { useState, useEffect } from "react";
import config from "../../config/index";
import { useComponentState, useProvider } from "../../hooks";
import { BettingContract } from "../../services/Contract";
import { Container, makeStyles, Grid } from "@material-ui/core";
import GameCard from "../../components/GameCard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";
import { unique } from "../../utils";

const useStyles = makeStyles(() => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "100vh",
  },
  gameContainer: {
    paddingTop: 16,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { state, setState, Error, LoadingAnimation } = useComponentState();
  const { provider, /*setProvider,*/ accounts /*setAccounts*/ } = useProvider();
  const [bettingContract, setBettingContract] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  const [games, setGames] = useState(null);
  const [isFilterGameToActive, setFilterGameToActive] = useState(true);
  const [mainMetrics, setMainMetrics] = useState(null);

  useEffect(() => {
    const fetchAndSetBettingContract = async (provider, accounts) => {
      try {
        const _bettingContract = new BettingContract(
          provider,
          config.initial_contract_address,
          accounts
        );
        setBettingContract(_bettingContract.contract);
        const _competitions = await _bettingContract.contract.methods
          .getCompetitions()
          .call();
        const formattedCompetitions = _competitions.map(
          ({ available, cover, description, name }, index) => ({
            name,
            cover,
            description,
            available,
            id: index + 1,
          })
        );
        setCompetitions(formattedCompetitions);
        setCompetition(formattedCompetitions[0]);
      } catch (error) {
        setState({ status: "error", code: 500 });
      }
    };

    if (provider && accounts) {
      fetchAndSetBettingContract(provider, accounts);
    }
  }, [provider, accounts]);

  useEffect(() => {
    const getAndSetGames = async () => {
      const _games = await bettingContract.methods
        .getGames(competition.id)
        .call();

      const formattedGames = _games.map(
        (
          {
            cover,
            description,
            ended,
            started,
            team1Name,
            team1Score,
            team2Name,
            team2Score,
            winner,
            start,
          },
          index
        ) => ({
          cover,
          description,
          ended,
          started,
          team1Name,
          team1Score,
          team2Name,
          team2Score,
          winner,
          start,
          id: index + 1,
        })
      );

      const _bets = await Promise.all(
        formattedGames.map(async (game) => {
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


      const getStats = (_bets, bettingContract, formattedGames, competitions) => {
        let transactionCount,
          uniqueAddressCount,
          avgTransactionCountPerAddress,
          avgGamePerCompetition,
          totalFunds,
          gamesCount,
          competitionCount;
      
        transactionCount = _bets.reduce((prev, next) => prev + next.bets.length, 0);
        uniqueAddressCount = unique(_bets.map((game) => game.uniqueUsers)).length;
        avgTransactionCountPerAddress = Math.ceil(
          transactionCount / uniqueAddressCount
        );
        avgGamePerCompetition = Math.ceil(
          formattedGames.length / competitions.length
        );
        totalFunds = bettingContract.utils
          .fromWei(`${_bets.reduce((prev, next) => prev + next.betsValue, 0)}`)
          .slice(0, 4);
        gamesCount = formattedGames.length;
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

      setMainMetrics(getStats(_bets, bettingContract, formattedGames, competitions));

      setGames(
        formattedGames.filter((game) => game.ended !== isFilterGameToActive)
      );
    };
    if (competitions && competition) {
      getAndSetGames();
    }
  }, [competitions, competition, bettingContract, isFilterGameToActive]);

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded")
    return (
      <div className={classes.gradient}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainMetrics
                userCount={mainMetrics?.uniqueAddressCount}
                totalFunds={mainMetrics?.totalFunds}
                competitionCount={mainMetrics?.competitionCount}
                gameCount={mainMetrics?.gamesCount}
                avgGamePerCompetition={mainMetrics?.avgGamePerCompetition}
                transactionCount={mainMetrics?.transactionCount}
                avgTransactionCountPerAddress={
                  mainMetrics?.avgTransactionCountPerAddress
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FiltersArea
                competition={competition}
                competitions={competitions}
                setCompetition={(selectedCompetition) =>
                  setCompetition(selectedCompetition)
                }
                isFilterGameToActive={isFilterGameToActive}
                setFilterGameToActive={(value) => setFilterGameToActive(value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} className={classes.gameContainer}>
                {games?.map((game) => (
                  <Grid item xs={12} lg={4}>
                    <GameCard
                      key={game.id}
                      competition={competition}
                      provider={provider}
                      accounts={accounts}
                      game={game}
                      bettingContract={bettingContract}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  else {
    return <Error code={state.code} />;
  }
};

export default Dashboard;
