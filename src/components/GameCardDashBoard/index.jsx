import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import { Grid } from "@material-ui/core";

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
}));

const GameCardDashBoard = ({
  game: { teamA, teamB, draw, datetime, description, media, id, competition },
  favorites,
  setFavorites,
}) => {
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
    const favoriteId = favorites.find((favId) => favId === id);
    favoriteId ? setIsFavorite(true) : setIsFavorite(false);
  }, []);

  return (
    <Card className={classes.root} id={`game-${id}`}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardMedia
            className={classes.media}
            image={media}
            title="Paella dish"
          />
        </Grid>
        <Grid item xs={4}>
          <CardHeader
            id={id}
            teamA={teamA}
            teamB={teamB}
            datetime={datetime}
            draw={draw}
            competition={competition}
          />
        </Grid>
        <Grid item xs={4}>
          <CardBody
            isFavorite={isFavorite}
            handleAddFavorite={handleAddFavorite}
            expanded={expanded}
            handleExpandClick={handleExpandClick}
            teamA={teamA}
            description={description}
            teamB={teamB}
            draw={draw}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default GameCardDashBoard;
