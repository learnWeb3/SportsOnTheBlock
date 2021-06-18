import React from "react";
import moment from "moment";
import {  makeStyles, Typography } from "@material-ui/core";
import CompetitionNamePanel from "../CompetitionNamePanel";

const useStyles = makeStyles((theme) => ({
  gamePanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
}));

const GamePanel = ({ competition, teamA, teamB, datetime }) => {
  const classes = useStyles();
  return (
    <div className={classes.gamePanel}>
      <CompetitionNamePanel competition={competition} />
      <Typography variant="h5" color="dark" component="p">
        {teamA.name.toUpperCase()}-{teamB.name.toUpperCase()}
      </Typography>
      <Typography variant="subtitle1" color="dark" component="p">
        {moment(datetime).format("ddd MM YYYY HH:SS")}
      </Typography>
    </div>
  );
};

export default GamePanel;
