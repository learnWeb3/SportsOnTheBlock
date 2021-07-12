import React, { useRef, useState } from "react";
import { useComponentState, useFavorites } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionBar from "../CardActionBar";
import GameCardHeader from "../GameCard/GameCardHeader/index";
import GameCardContent from "../GameCard/GameCardContent/index";
import GameCardAdminCollapse from "./GameCardAdminCollapse/index";
import GameCardMedia from "../GameCard/GameCardMedia/index";

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
    padding: "1rem",
    margin: "auto",
    width: "unset",
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

const GameCardAdmin = ({
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
  competition,
  isPresentInContract,
  createNewGame,
  setAlert,
}) => {
  const classes = useStyles();
  // access component hooks to deal with favorites actions
  const { favorites, setFavorites, isFavorite, handleAddFavorite } =
    useFavorites(id);

  // Access custom hooks to display errors and loading animations
  const { state, ErrorComponent, LoadingAnimation } = useComponentState();

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (state.status === "loading") return <LoadingAnimation />;
  else {
    const game = {
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
    };
    return (
      <Card className={classes.root}>
        {state.status === "loaded" ? (
          <>
            <GameCardHeader
              game={game}
              competition={competition}
              isPresentInContract={isPresentInContract}
            />
            <GameCardMedia game={game} />
            <GameCardContent game={game} />
            <CardActionBar
              handleAddFavorite={handleAddFavorite}
              isFavorite={isFavorite}
              handleExpandClick={handleExpandClick}
              expanded={expanded}
              gameId={id}
              isPresentInContract={isPresentInContract}
            />
            <GameCardAdminCollapse
              competition={competition}
              createNewGame={createNewGame}
              expanded={expanded}
              setAlert={setAlert}
              game={game}
              isPresentInContract={isPresentInContract}
            />
          </>
        ) : (
          state.status === "error" && <ErrorComponent />
        )}
      </Card>
    );
  }
};

export default GameCardAdmin;
