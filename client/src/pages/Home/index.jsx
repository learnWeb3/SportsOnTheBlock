import React, { useState, useEffect } from "react";
import config from "../../config/index.json";
import { useComponentState, useProvider } from "../../hooks";
import { BettingContract } from "../../services/Contract";
import { Container, makeStyles, Grid } from "@material-ui/core";
import GameCard from "../../components/GameCard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";
import {
  getCompetitions,
  getGames,
  makeStats,
  getBets,
  subscibeToEvents,
} from "./helpers";

const useStyles = makeStyles(() => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "87vh",
  },
  gameContainer: {
    paddingTop: 16,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { state, setState, ErrorPage, LoadingAnimation } = useComponentState();
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
          config.betting_contract_address,
          accounts
        );
        setBettingContract(_bettingContract.contract);
        const _competitions = await getCompetitions(_bettingContract);
        setCompetitions(_competitions);
        setCompetition(_competitions[0]);
      } catch (error) {
        console.log(error)
        setState({ status: "error", code: 500 });
      }
    };

    if (provider && accounts) {
      fetchAndSetBettingContract(provider, accounts);
    }
  }, [provider, accounts]);

  useEffect(() => {
    const fetchAndSetMainMetricsAndGames = async (bettingContract) => {
      try {
        const _games = await getGames(bettingContract, competition.id);
        const _bets = await getBets(bettingContract, _games);
        setMainMetrics(makeStats(_bets, bettingContract, _games, competitions));
        setGames(_games.filter((game) => game.ended !== isFilterGameToActive));
        //subscibeToEvents();
      } catch (error) {
        console.log(error)
        setState({ status: "error", code: 500 });
      }
    };
    if (competitions && competition) {
      fetchAndSetMainMetricsAndGames(bettingContract);
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
                {games?.length > 0 ? (
                  games.map((game) => (
                    <Grid item xs={12} lg={4} key={game.id}>
                      <GameCard
                        competition={competition}
                        provider={provider}
                        accounts={accounts}
                        game={game}
                        bettingContract={bettingContract}
                      />
                    </Grid>
                  ))
                ) : (
                  <ErrorPage code={404} height="100%" messageDisplayed={false} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  else {
    return <ErrorPage code={state.code} height="90vh" />;
  }
};

export default Home;