import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useComponentState, useFavorites } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Modal from "../Modal/index";
import BetForm from "../BetForm/index";
import CardActionBar from "../CardActionBar";
import GameCardCollapse from "./GameCardCollapse/index";
import GameCardHeader from "./GameCardHeader/index";
import GameCardContent from "./GameCardContent/index";
import GameCardMedia from "./GameCardMedia/index";
import { getBets, getUserGains } from "./helper.js";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    padding: 16,
    justifyContent: "space-between",
    "& h5": {
      fontWeight: 700,
    },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  gameName: {
    marginBottom: 8,
  },
}));

const GameCard = ({
  setAlert,
  newBetPresent,
  refreshGamesCounter,
  setRefresGamesCounter,
  competition,
  bettingContract,
  accounts,
  game: {
    id,
    team1Logo,
    team2Logo,
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    description,
    start,
    ended,
    started,
    winner,
    loserBetsSum,
    winnerBetsSum,
  },
}) => {
  // component styles
  const classes = useStyles();

  // Access custom hooks to display errors and loading animations
  const {
    state,
    setState,
    ErrorComponent,
    LoadingAnimation,
    isModalToogled,
    setModalToogled,
  } = useComponentState();

  // Access component hooks to deal with favorites actions
  const { favorites, setFavorites, isFavorite, handleAddFavorite } =
    useFavorites(id);

  // Access userGains on current game if game is settled aka ended
  const [userGains, setuserGains] = useState(0);
  useEffect(() => {
    const fetchAndSetuserGains = async (id) => {
      try {
        const userGains = await getUserGains(
          id,
          winnerBetsSum,
          loserBetsSum,
          bettingContract
        );
        const userGainsEth = bettingContract.utils.fromWei(
          `${userGains}`,
          "ether"
        );
        setuserGains(userGainsEth);
      } catch (error) {
        console.log(error);
        setuserGains(0);
      }
    };

    ended && fetchAndSetuserGains(id);
  }, []);

  // Access bets on current game to display funds by side
  const [bets, setBets] = useState(null);
  useEffect(() => {
    const getAndSetBets = async (bettingContract, id) => {
      try {
        const _bets = await getBets(bettingContract, id);
        setBets(_bets);
      } catch (error) {
        console.log(error);
        setState({ status: "error", code: 500 });
      }
    };
    if (id) {
      getAndSetBets(bettingContract, id);
    }
  }, [isModalToogled, refreshGamesCounter]);

  // Access alert message in order to display it on current game card
  const [cardAlertMessage, setCardAlertMessage] = useState(null);
  useEffect(() => {
    setCardAlertMessage("New bet sent to contract");
    setTimeout(() => {
      setCardAlertMessage("");
    }, 6000);
  }, [refreshGamesCounter]);

  // Access expansion state of the card
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (state.status === "loading") return <LoadingAnimation />;
  else {
    const game = {
      id,
      team1Logo,
      team2Logo,
      team1Name,
      team2Name,
      team1Score,
      team2Score,
      description,
      start,
      ended,
      started,
      winner,
      loserBetsSum,
      winnerBetsSum,
    };
    return (
      <>
        <Card className={classes.root}>
          {state.status === "loaded" ? (
            <>
              <GameCardHeader
                newBetPresent={newBetPresent}
                cardAlertMessage={cardAlertMessage}
                bettingContract={bettingContract}
                userGains={userGains}
                game={game}
                competition={competition}
              />

              <GameCardMedia game={game} />

              <GameCardContent game={game} />

              <CardActionBar
                gameId={id}
                isFavorite={isFavorite}
                handleAddFavorite={handleAddFavorite}
                expanded={expanded}
                handleExpandClick={handleExpandClick}
              />

              <GameCardCollapse
                game={game}
                betStats={bets?.betStats}
                userGains={userGains}
                accounts={accounts}
                bettingContract={bettingContract}
                competition={competition}
                expanded={expanded}
                setAlert={(alert) => setAlert(alert)}
                setModalToogled={setModalToogled}
                refreshGamesCounter={refreshGamesCounter}
                setRefresGamesCounter={setRefresGamesCounter}
              />
            </>
          ) : (
            state.status === "error" && <ErrorComponent />
          )}
        </Card>
        {isModalToogled &&
          ReactDOM.createPortal(
            <Modal
              component={BetForm}
              title={`Place a bet on :`}
              buttonLabel="confirm"
              setModalToogled={setModalToogled}
              game={game}
              bettingContract={bettingContract}
              accounts={accounts}
            />,
            document.querySelector("body")
          )}
      </>
    );
  }
};

export default GameCard;
