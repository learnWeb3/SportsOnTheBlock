import { Container, Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    "& button": {
      width: "30%",
    },
    "& p": {
      width: "100%",
      textAlign: "center",
    },
  },
  margin16: {
    marginTop: 16,
  },
  margin64: {
    marginTop: 64,
  },
  finalScorePanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
}));

const BetButtonBar = ({
  marginTop,
  game: { teamA, teamB, draw, gameStatus, playTime },
}) => {
  const classes = useStyles();
  return (
    <Container
      className={
        marginTop
          ? clsx(classes.root, classes.margin64)
          : clsx(classes.root, classes.margin16)
      }
    >
      {gameStatus === "INCOMING" && (
        <>
          <Button variant="contained" color="secondary">
            {teamA.betValue} ETH
          </Button>
          <Button variant="contained" color="primary">
            {draw.betValue} ETH
          </Button>
          <Button variant="contained" color="secondary">
            {teamB.betValue} ETH
          </Button>
        </>
      )}

      {gameStatus === "PLAYING" && (
        <Typography component="p" variant="h6">
          {teamA.score} - {teamB.score}
        </Typography>
      )}
      {gameStatus === "ENDED" && (
        <div className={classes.finalScorePanel}>
          <Typography component="p" variant="p">
            {playTime}'
          </Typography>
          <Typography component="p" variant="h6">
            {teamA.score} - {teamB.score}
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default BetButtonBar;
