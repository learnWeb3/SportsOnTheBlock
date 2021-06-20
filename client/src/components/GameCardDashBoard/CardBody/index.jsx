import React from "react";
import { makeStyles } from "@material-ui/core";
import CardActionBar from "../../CardActionBar";
import GameDescriptionPanel from "../../GameDescriptionPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    textAlign: "justify",
    marginTop: 16,
  },
}));

const CardBody = ({ game }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GameDescriptionPanel description={game.description} />
    </div>
  );
};

export default CardBody;
