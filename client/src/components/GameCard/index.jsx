import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Context from "../../context/index";
import { useComponentState } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import {
  CardContent,
  CardMedia,
  Collapse,
  Typography,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import Modal from "../Modal/index";
import BetForm from "../BetForm/index";
import CardActionBar from "../CardActionBar";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    padding: 16,
    justifyContent: "space-between",
  },
  media: {
    width: "100%",
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
  datagrid: {
    height: 275,
    width: "100%",
  },
  collapse: {
    paddingTop: 16,
  },
}));

const GameCardDashBoard = ({
  bettingContract,
  accounts,
  game: {
    cover,
    description,
    ended,
    started,
    team1Name,
    team1Score,
    team2Name,
    team2Score,
    winner,
    id,
  },
}) => {
  const classes = useStyles();
  // Access custom hooks to display errors and loading animations
  const {
    state,
    setState,
    Error,
    LoadingAnimation,
    isModalToogled,
    setModalToogled,
  } = useComponentState();
  // 0- check if user favorite the current game
  const { favorites, setFavorites } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState();

  useEffect(() => {
    const favoriteId = favorites.find((id) => id === id);
    favoriteId ? setIsFavorite(true) : setIsFavorite(false);
  }, []);

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

  const columns = [
    { field: "user", headerName: "#", width: 600 },
    { field: "value", headerName: "value", width: 300 },
    { field: "date", headerName: "date", width: 300 },
  ];

  // 3- Transactions
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
    // setTransactions
  };

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded") {
    return (
      <>
        <Card className={classes.root}>
          <CardMedia src={cover} />
          <CardContent>
            <Typography variant="h5" component="h5">
              {team1Name.toUpperCase()}&nbsp;vs&nbsp;{team2Name.toUpperCase()}
            </Typography>
            <Typography variant="body1" component="p">
              {description}
            </Typography>
          </CardContent>
          <CardActionBar
            handleAddFavorite={handleAddFavorite}
            isFavorite={isFavorite}
            handleExpandClick={handleExpandClick}
            expanded={expanded}
            gameId={id}
            setModalToogled={setModalToogled}
          />
          <Collapse
            className={classes.collapse}
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <div className={classes.datagrid}>
              <DataGrid rows={[]} columns={columns} />
            </div>
          </Collapse>
        </Card>
        {isModalToogled &&
          ReactDOM.createPortal(
            <Modal
              component={BetForm}
              title={`Place a bet on ${team1Name?.toUpperCase()} vs ${team2Name?.toUpperCase()}`}
              buttonLabel="confirm"
              setModalToogled={setModalToogled}
              game={{
                cover,
                description,
                ended,
                started,
                team1Name,
                team1Score,
                team2Name,
                team2Score,
                winner,
                id,
              }}
              bettingContract={bettingContract}
              accounts={accounts}
            />,
            document.querySelector("body")
          )}
      </>
    );
  } else {
    return <Error code={500} />;
  }
};

export default GameCardDashBoard;
