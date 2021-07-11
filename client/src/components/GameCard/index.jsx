import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useComponentState, useFavorites } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Modal from "../Modal/index";
import BetForm from "../BetForm/index";
import CardActionBar from "../CardActionBar";
import { getBets } from "./helper.js";
import GameCardCollapse from "./GameCardCollapse/index";
import GameCardHeader from "./GameCardHeader/index";
import GameCardContent from "./GameCardContent/index";
import GameCardMedia from "./GameCardMedia/index";

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
  newBetPresent,
  refreshGamesCounter,
  competition,
  bettingContract,
  accounts,
  game: {
    team1Logo,
    team2Logo,
    description,
    ended,
    started,
    team1Name,
    team1Score,
    team2Name,
    team2Score,
    winner,
    start,
    id,
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

  // access component hooks to deal with favorites actions
  const { favorites, setFavorites, isFavorite, handleAddFavorite } =
    useFavorites(id);

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

  const [cardAlertMessage, setCardAlertMessage] = useState(null);
  useEffect(() => {
    setCardAlertMessage("New bet sent to contract");

    setTimeout(() => {
      setCardAlertMessage("");
    }, 6000);
  }, [refreshGamesCounter]);

  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (state.status === "loading") return <LoadingAnimation />;
  else {
    return (
      <>
        <Card className={classes.root}>
          {state.status === "loaded" ? (
            <>
              <GameCardHeader
                newBetPresent={newBetPresent}
                cardAlertMessage={cardAlertMessage}
                game={{
                  team1Logo,
                  team2Logo,
                  description,
                  ended,
                  started,
                  team1Name,
                  team1Score,
                  team2Name,
                  team2Score,
                  winner,
                  start,
                  id,
                }}
                competition={competition}
              />

              <GameCardMedia
                game={{
                  team1Logo,
                  team2Logo,
                  description,
                  ended,
                  started,
                  team1Name,
                  team1Score,
                  team2Name,
                  team2Score,
                  winner,
                  start,
                  id,
                }}
              />

              <GameCardContent
                game={{
                  team1Logo,
                  team2Logo,
                  description,
                  ended,
                  started,
                  team1Name,
                  team1Score,
                  team2Name,
                  team2Score,
                  winner,
                  start,
                  id,
                }}
              />
              <CardActionBar
                handleAddFavorite={handleAddFavorite}
                isFavorite={isFavorite}
                handleExpandClick={handleExpandClick}
                expanded={expanded}
                gameId={id}
              />
              <GameCardCollapse
                competition={competition}
                expanded={expanded}
                setModalToogled={setModalToogled}
                game={{
                  team1Logo,
                  team2Logo,
                  description,
                  ended,
                  started,
                  team1Name,
                  team1Score,
                  team2Name,
                  team2Score,
                  winner,
                  start,
                  id,
                }}
                betStats={bets?.betStats}
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
              game={{
                team1Logo,
                team2Logo,
                description,
                ended,
                started,
                team1Name,
                team1Score,
                team2Name,
                team2Score,
                winner,
                start,
                id,
              }}
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
