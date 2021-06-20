import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import { CardContent, Grid, Typography, Collapse } from "@material-ui/core";
import GameDescriptionPanel from "../GameDescriptionPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: "left",
    padding: 16,
  },
  media: {
    height: "100%",
    width: "100%",
  },
  description: {
    marginTop: 16,
  },
}));

const GameCard = ({ game, favorites, setFavorites, competition }) => {
  const [isFavorite, setIsFavorite] = useState();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
          <CardHeader game={game} competition={competition} />
        </Grid>
      </Grid>
      <CardBody
        isFavorite={isFavorite}
        handleAddFavorite={handleAddFavorite}
        expanded={expanded}
        handleExpandClick={handleExpandClick}
        game={game}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <GameDescriptionPanel description={game.description} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default GameCard;
