import React, { useState, useEffect } from "react";
import config from "../../config/index";
import { useComponentState, useProvider } from "../../hooks";
import { BettingContract } from "../../services/Contract";
import { Container, makeStyles, Grid } from "@material-ui/core";
import GameCard from "../../components/GameCard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";

const useStyles = makeStyles(() => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "100vh",
  },
  gameContainer: {
    paddingTop:16
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { state, setState, Error, LoadingAnimation } = useComponentState();
  const { provider, setProvider, accounts, setAccounts } = useProvider();
  const [bettingContract, setBettingContract] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  const [games, setGames] = useState(null);
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
          id: index + 1,
        })
      );
      setGames(formattedGames);
    };
    if (competitions && competition) {
      getAndSetGames();
    }
  }, [competitions, competition, bettingContract]);

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded")
    return (
      <div className={classes.gradient}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainMetrics
                userCount={10}
                totalFunds={5}
                competitionCount={9}
                gameCount={18}
                avgGamePerCompetition={9}
                transactionCount={200}
                avgTransactionCountPerAddress={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FiltersArea
                competition={competition}
                competitions={competitions}
                setCompetition={(selectedCompetition) =>
                  setCompetition(selectedCompetition)
                }
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
                      accounts={accounts}
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
