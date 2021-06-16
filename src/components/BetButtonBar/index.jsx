import { Container, Button, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  buttons: {
    width: "30%",
  },
  buttonBar: {
    marginTop: 16,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
}));

const BetButtonBar = ({ teamA, teamB, draw }) => {
  const classes = useStyles();
  return (
    <Container className={classes.buttonBar}>
      <Button className={classes.buttons} variant="contained" color="secondary">
        {teamA.betValue} ETH
      </Button>
      <Button className={classes.buttons} variant="contained" color="primary">
        {draw.betValue} ETH
      </Button>
      <Button className={classes.buttons} variant="contained" color="secondary">
        {teamB.betValue} ETH
      </Button>
    </Container>
  );
};

export default BetButtonBar;
