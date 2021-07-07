import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Context from "../../context/index";
import { server_root_path } from "../../config/index.json";
import { useComponentState } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { CardMedia } from "@material-ui/core";
import capitalize from "capitalize";
import Modal from "../Modal/index";
import BetForm from "../BetForm/index";
import CardActionBar from "../CardActionBar";
import { getBets } from "./helper.js";
import GameCardCollapse from "./GameCardCollapse/index";
import GameCardHeader from "./GameCardHeader/index";
import GameCardContent from "./GameCardContent/index";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    padding: 16,
    justifyContent: "space-between",
    "& h5": {
      fontWeight: 700,
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
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
  // 0- check if user favorite the current game
  const { favorites, setFavorites } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState();
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
      const favoriteId = favorites.find((gameId) => gameId === id);
      favoriteId ? setIsFavorite(true) : setIsFavorite(false);
      getAndSetBets(bettingContract, id);
    }
  }, [id, isModalToogled]);

  const handleAddFavorite = (id) => {
    if (!isFavorite) {
      setIsFavorite(true);
      localStorage.setItem("favoriteGames", JSON.stringify([...favorites, id]));
      setFavorites([...favorites, id]);
    } else {
      setIsFavorite(false);
      const newFavorites = favorites.filter((id) => id !== id);
      localStorage.setItem("favoriteGames", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

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
              <CardMedia
                image={server_root_path + team1Logo}
                className={classes.media}
                title={`${capitalize(team1Name)} vs ${capitalize(team2Name)}`}
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
