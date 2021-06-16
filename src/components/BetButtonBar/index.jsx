import { Container, Button, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    "& button": {
      width: "30%",
    },
  },
}));

const BetButtonBar = ({ teamA, teamB, draw }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Button variant="contained" color="secondary">
        {teamA.betValue} ETH
      </Button>
      <Button variant="contained" color="primary">
        {draw.betValue} ETH
      </Button>
      <Button variant="contained" color="secondary">
        {teamB.betValue} ETH
      </Button>
    </Container>
  );
};

export default BetButtonBar;
