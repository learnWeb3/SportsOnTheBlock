import React from "react";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    "& svg": {
      marginRight: 8,
    },
  },
}));

const CompetitionNamePanel = ({ competition }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <SportsSoccerIcon fontSize="large" />
      <Typography variant="h5" component="p">
        {competition.name}
      </Typography>
    </div>
  );
};

export default CompetitionNamePanel;

