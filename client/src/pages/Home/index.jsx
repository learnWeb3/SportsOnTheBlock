import React, { useState, useEffect } from "react";
import ReactDOM from "react";
import config from "../../config/index.json";
import { useComponentState, useProvider } from "../../hooks";
import { BettingContract } from "../../services/Contract";
import { Container, makeStyles, Grid } from "@material-ui/core";
import SnackBar from "../../components/SnackBar.index";
import GameCard from "../../components/GameCard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";
import { fetchData } from "../Admin/helpers";
import {
  getCompetitions,
  getGames,
  makeStats,
  getBets,
  subscribeToEvents,
} from "./helpers";

const useStyles = makeStyles(() => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "95vh",
  },
  gameContainer: {
    paddingTop: 16,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { state, setState, ErrorPage, LoadingAnimation, alert, setAlert } =
    useComponentState();
  const { provider, /*setProvider,*/ accounts /*setAccounts*/ } = useProvider();
  const [isFilterGameToActive, setFilterGameToActive] = useState(true);

  const [refreshCompetitionsCounter, setRefresCompetitionsCounter] =
    useState(0);
  const [refreshGamesCounter, setRefresGamesCounter] = useState(0);
  const [newBet, setNewBet] = useState(null);

  const [bettingContract, setBettingContract] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  useEffect(() => {
    const fetchAndSetBettingContract = async (provider, accounts) => {
      try {
        setState({ status: "loading", code: null });
        const _bettingContract = new BettingContract(
          provider,
          config.betting_contract_address,
          accounts
        );
        setBettingContract(_bettingContract.contract);
        const _competitions = await getCompetitions(_bettingContract);
        if (_competitions.length > 0) {
          setCompetitions(_competitions);
          setCompetition(_competitions[0]);
        } else {
          setState({
            status: "error",
            code: 404,
            message: "Nothing here yet, please come back later",
          });
        }
      } catch (error) {
        console.log(error);
        setState({ status: "error", code: 500 });
      }
    };

    if (provider && accounts) {
      fetchAndSetBettingContract(provider, accounts);
    }
  }, [provider, accounts, refreshCompetitionsCounter]);

  const [contractGames, setContractGames] = useState(null);
  const [games, setGames] = useState(null);
  const [mainMetrics, setMainMetrics] = useState(null);

  useEffect(() => {
    const fetchAndSetMainMetricsAndGames = async (bettingContract) => {
      try {
        setState({ status: "loading", code: null });
        const _games = await fetchData(`/competitions/${competition.id}/games`);
        const _contract_games = await getGames(bettingContract, competition.id, _games, isFilterGameToActive);
        const _bets = await getBets(bettingContract, _contract_games);
        setMainMetrics(
          makeStats(_bets, bettingContract, _contract_games, competitions)
        );
        setContractGames(_contract_games);
        setGames([..._games]);
        setState({ status: "loaded", code: null });
      } catch (error) {
        console.log(error);
        setState({ status: "error", code: 500 });
      }
    };

    const refreshCompetitions = () => {
      setRefresCompetitionsCounter(refreshCompetitionsCounter + 1);
    };
    const refreshGames = () => {
      setRefresGamesCounter(refreshGamesCounter + 1);
    };

    const refreshBets = (value) => {
      setRefresGamesCounter(refreshGamesCounter + 1);
      setNewBet(value);
    };

    if (bettingContract && competitions && competition) {
      fetchAndSetMainMetricsAndGames(bettingContract);
      subscribeToEvents(
        bettingContract,
        refreshGames,
        refreshCompetitions,
        refreshBets
      );
    }
  }, [
    competitions,
    competition,
    bettingContract,
    isFilterGameToActive,
    refreshGamesCounter,
  ]);

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded")
    return (
      <>
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
                  setCompetition={(selectedCompetition) => {
                    setCompetition(selectedCompetition);
                  }}
                  isFilterGameToActive={isFilterGameToActive}
                  setFilterGameToActive={(value) =>
                    setFilterGameToActive(value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} className={classes.gameContainer}>
                  {contractGames?.length > 0 ? (
                    contractGames?.map((game) => {
                      return (
                        <Grid item xs={12} lg={4} key={game.id}>
                          <GameCard
                            competition={competition}
                            provider={provider}
                            accounts={accounts}
                            game={game}
                            bettingContract={bettingContract}
                            refreshGamesCounter={refreshGamesCounter}
                            newBetPresent={newBet === parseInt(game.id)}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <ErrorPage
                      code={404}
                      height="100%"
                      messageDisplayed={false}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>

        {alert.toogled &&
          ReactDOM.createPortal(
            <SnackBar
              message={alert.message}
              type={alert.type}
              setAlert={setAlert}
            />,
            document.querySelector("body")
          )}
      </>
    );
  else {
    return (
      <ErrorPage code={state.code} height="90vh" message={state.message} />
    );
  }
};

export default Home;
