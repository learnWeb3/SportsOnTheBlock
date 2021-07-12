import React from "react";
import {
  Collapse,
  Typography,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import capitalize from "capitalize";
import CardAlert from "../../CardAlert/index";

const useStyles = makeStyles((theme) => ({
  collapse: {
    paddingTop: 16,
  },
  betButton: {
    width: "100%",
  },
  betStats: {
    padding: 16,
  },
  textRight: {
    textAlign: "right",
  },
}));

const GameCardCollapse = ({
  bettingContract,
  accounts,
  setAlert,
  expanded,
  setModalToogled,
  game,
  betStats,
  userGains,
  refreshGamesCounter,
  setRefresGamesCounter,
}) => {
  const classes = useStyles();

  const handleUserGains = async (game) => {
    try {
      const tx = await bettingContract.methods
        .claimProfits(game.id)
        .send({ from: accounts[0], gas: 200000 });

      if (tx.error) {
        throw new Error(`problem sending transaction`);
      }
      setRefresGamesCounter(refreshGamesCounter + 1);
      setAlert({
        toogled: true,
        message: "funds have been successfully sent to your address",
        type: "success",
      });
      setRefresGamesCounter();
    } catch (error) {
      setAlert({
        toogled: true,
        message: "error when sending funds back to your address",
        type: "error",
      });
    }
  };
  return (
    <Collapse
      className={classes.collapse}
      in={expanded}
      timeout="auto"
      unmountOnExit
    >
      <Grid container spacing={2} className={classes.betStats}>
        <Grid item xs={12}>
          <Typography variant="body1" component="p">
            Current value locked
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p">
            {game && capitalize(game?.team1Name)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p" className={classes.textRight}>
            {betStats?.team1BetsValue}
            &nbsp;ETH
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p">
            {"Draw"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p" className={classes.textRight}>
            {betStats?.drawBetsValue}
            &nbsp;ETH
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p">
            {game && capitalize(game?.team2Name)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="p" className={classes.textRight}>
            {betStats?.team2BetsValue}
            &nbsp;ETH
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {!game?.started && !game?.ended && (
            <Button
              className={classes.betButton}
              size="large"
              color="secondary"
              variant="contained"
              onClick={() => setModalToogled(true)}
            >
              place a bet
            </Button>
          )}
        </Grid>
        {game.ended && userGains > 0 && (
          <Grid item xs={12}>
            <CardAlert
              message={`Congratulations, the odds were in your favor ! Please retrieve your gains ${userGains} ETH`}
              autoUnmount={false}
            />
            <Button
              className={classes.betButton}
              size="large"
              color="secondary"
              variant="contained"
              onClick={() => handleUserGains(game)}
            >
              GET MY GAINS - {userGains} ETH
            </Button>
          </Grid>
        )}
      </Grid>
    </Collapse>
  );
};

export default GameCardCollapse;
