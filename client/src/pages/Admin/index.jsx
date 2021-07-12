import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useComponentState, useProvider } from "../../hooks";
import { Container, makeStyles, Grid } from "@material-ui/core";
import FiltersArea from "../../components/FiltersArea";
import { fetchData } from "./helpers";
import GameCardAdmin from "../../components/GameCardAdmin/index";
import SnackBar from "../../components/SnackBar.index";
import { BettingContract, OracleContract } from "../../services/Contract";
import {
  oracle_contract_address,
  betting_contract_address,
} from "../../config/index.json";
import CreateCompetitionZone from "../../components/CreateCompetitionZone/index";

const useStyles = makeStyles(() => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "95vh",
    paddingTop: 24,
    paddingBottom: 24,
  },
  gameContainer: {
    paddingTop: 16,
  },
}));

const Admin = () => {
  const classes = useStyles();
  const { state, setState, ErrorPage, LoadingAnimation, alert, setAlert } =
    useComponentState();
  const { provider, /*setProvider,*/ accounts /*setAccounts*/ } = useProvider();
  const [isFilterGameToActive, setFilterGameToActive] = useState(true);
  const [competition, setCompetition] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  const [currentContractCompetitionsIds, setCurrentContractCompetitionsIds] =
    useState(null);
  const [games, setGames] = useState(null);
  const [currentGamesContractIds, setCurrentGamesContractIds] = useState(null);
  const [oracleContract, setOracleContract] = useState(null);
  const [bettingContract, setBettingContract] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const createNewGame = async (gameId, competitionId, start) => {
    try {
      const tx = await oracleContract.contract.methods
        .newGame(gameId, competitionId, start)
        .send({ from: accounts[0], gas: 150000 });
      if (tx.error) {
        throw new Error(`problem sending transaction`);
      }
      setRefreshCounter(refreshCounter + 1);
      setAlert({
        toogled: true,
        message: "New game crated and available in the contract",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      setAlert({
        toogled: true,
        message: "We encoutered an unexpected error, please try again",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const initialContractSet = () => {
      try {
        setState({ status: "loading", code: null });
        setOracleContract(
          new OracleContract(provider, oracle_contract_address, accounts)
        );
        setBettingContract(
          new BettingContract(provider, betting_contract_address, accounts)
        );
      } catch (error) {
        console.log(error);
        setState({ status: "error", code: 500 });
      }
    };

    provider && oracle_contract_address && accounts && initialContractSet();
  }, [provider, oracle_contract_address, accounts]);

  useEffect(() => {
    const fetchAndSetCompetitions = async () => {
      try {
        const _competitions = await fetchData("/competitions");
        const _currentContractCompetitionsIds =
          await bettingContract.contract.methods
            .getCompetitions()
            .call()
            .then((competitionsIds) =>
              competitionsIds.map((_competitionId) => parseInt(_competitionId))
            );
        setCurrentContractCompetitionsIds(_currentContractCompetitionsIds);
        setCompetitions(_competitions);
        setCompetition(_competitions[0]);
      } catch (error) {
        console.log(error);
        setState({ status: "error", code: 500 });
      }
    };
    oracleContract && fetchAndSetCompetitions();
  }, [refreshCounter, oracleContract]);

  useEffect(() => {
    const fetchAndSetGames = async (competition) => {
      try {
        setState({ status: "loading", code: null });
        const _currentGamesContractIds = await bettingContract.contract.methods
          .getGames(competition.id)
          .call()
          .then((gamesIds) => gamesIds.map((id) => parseInt(id)));
        setCurrentGamesContractIds(_currentGamesContractIds);
        const _games = await fetchData(`/competitions/${competition.id}/games`);
        setGames(_games.filter((game) => game.ended !== isFilterGameToActive));
        setState({ status: "loaded", code: null });
      } catch (error) {
        console.log(error);
        setState({ status: "loaded", code: null });
        setAlert({
          toogled: true,
          message: "Competition does not exist yet",
          type: "error",
        });
      }
    };
    competition && fetchAndSetGames(competition);
  }, [competition, isFilterGameToActive]);

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded")
    return (
      <div className={classes.gradient}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CreateCompetitionZone
                accounts={accounts}
                setAlert={setAlert}
                oracleContract={oracleContract}
                bettingContract={bettingContract}
                competitions={competitions}
                refreshCounter={refreshCounter}
                setRefreshCounter={setRefreshCounter}
              />
            </Grid>
            <Grid item xs={12}>
              <FiltersArea
                competition={competition}
                competitions={competitions?.filter((_competition) =>
                  currentContractCompetitionsIds.includes(_competition.id)
                )}
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
                  games
                    .filter((game) => game.ended !== isFilterGameToActive)
                    .map((game) => (
                      <Grid item xs={12} lg={4} key={`admin-game-${game.id}`}>
                        <GameCardAdmin
                          isPresentInContract={
                            currentGamesContractIds?.includes(game.id)
                              ? true
                              : false
                          }
                          competition={competition}
                          provider={provider}
                          accounts={accounts}
                          game={game}
                          isFilterGameToActive={isFilterGameToActive}
                          setAlert={setAlert}
                          createNewGame={createNewGame}
                        />
                      </Grid>
                    ))
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

        {alert.toogled &&
          ReactDOM.createPortal(
            <SnackBar
              message={alert.message}
              type={alert.type}
              setAlert={setAlert}
            />,
            document.querySelector("body")
          )}
      </div>
    );
  else {
    return <ErrorPage code={state.code} height="90vh" />;
  }
};

export default Admin;
