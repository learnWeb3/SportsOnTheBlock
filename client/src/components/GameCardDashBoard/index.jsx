import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import { CardContent, Grid } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { DataGrid } from "@material-ui/data-grid";
import CardActionBar from "../CardActionBar/index";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: "left",
    padding: 16,
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

const GameCardDashBoard = ({ game, favorites, setFavorites, competition }) => {
  const [isFavorite, setIsFavorite] = useState();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const columns = [
    { field: "txHash", headerName: "#", width: 600 },
    { field: "value", headerName: "value", width: 300 },
    { field: "date", headerName: "date", width: 300 },
  ];

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      txHash:
        "0x6c6d0c8f071c9dc33b5f6f1ece6199c00a56ea93cd3befb7f5e20754033b1ae0",
      value: 3.639,
      date: "",
    },
    {
      id: 2,
      txHash:
        "0x6c6d0c8f071c9dc33b5f6f1ece6199c00a56ea93cd3befb7f5e20754033b1ae0",
      value: 2.6995,
      date: "",
    },
    {
      id: 3,
      txHash:
        "0x6c6d0c8f071c9dc33b5f6f1ece6199c00a56ea93cd3befb7f5e20754033b1ae0",
      value: 50.99,
      date: "",
    },
  ]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    // fetch transactions
    // setTransactions
  };

  const handleAddFavorite = (id) => {
    if (!isFavorite) {
      setIsFavorite(true);
      localStorage.setItem("favoriteGames", JSON.stringify([...favorites, id]));
      setFavorites([...favorites, id]);
    } else {
      setIsFavorite(false);
      const newFavorites = favorites.filter((favorite) => favorite === id);
      localStorage.setItem("favoriteGames", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  useEffect(() => {
    const favoriteId = favorites.find((favId) => favId === game.id);
    favoriteId ? setIsFavorite(true) : setIsFavorite(false);
  }, []);

  return (
    <Card className={classes.root} id={`game-${game.id}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <img src={game.media} alt="game cover" className={classes.media} />
        </Grid>
        <Grid item xs={12} lg={8}>
          <CardContent>
            <CardHeader competition={competition} game={game} />
            <CardBody game={game} />
          </CardContent>
        </Grid>
        <CardActionBar
          isFavorite={isFavorite}
          handleAddFavorite={handleAddFavorite}
          expanded={expanded}
          handleExpandClick={handleExpandClick}
          game={game}
        />
      </Grid>
      <Collapse
        className={classes.collapse}
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <div className={classes.datagrid}>
          <DataGrid rows={transactions} columns={columns} />
        </div>
      </Collapse>
    </Card>
  );
};

export default GameCardDashBoard;