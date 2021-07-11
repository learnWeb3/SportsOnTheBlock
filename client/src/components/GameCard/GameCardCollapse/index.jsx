import React from "react";
import {
  Collapse,
  Typography,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import capitalize from "capitalize";

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

const GameCardCollapse = ({ expanded, setModalToogled, game, betStats }) => {
  const classes = useStyles();
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
          {!game?.started && (
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
      </Grid>
    </Collapse>
  );
};

export default GameCardCollapse;
