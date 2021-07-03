import React from "react";
import { CardContent, Typography, makeStyles } from "@material-ui/core";
import capitalize from "capitalize";

const useStyles = makeStyles(() => ({
  gameName: {
    marginBottom: 8,
  },
}));

const GameCardContent = ({ game }) => {
  const classes = useStyles();
  return (
    <CardContent>
      <Typography className={classes.gameName} variant="h6" component="h5">
        {`${capitalize(game?.team1Name)} vs ${capitalize(game?.team2Name)}`}
      </Typography>
      <Typography variant="body1" component="p">
        {game?.description}
      </Typography>
    </CardContent>
  );
};

export default GameCardContent;
