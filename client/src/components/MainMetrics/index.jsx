import React from "react";
import { Grid, Paper, Typography, makeStyles } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles((theme) => ({
  grid: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  mainmetric: {
    padding: 16,
    minHeight: 200,
  },
  icon: {
    fontSize: "2.125rem",
    height: "3rem",
    width: "3rem",
    borderRadius: "50%",
    backgroundImage: "linear-gradient(to left, #FFC371 0%, #FF5F6D  100%)",
    padding: 8,
    marginRight: 8,
    color: "white",
  },
}));

const MainMetrics = ({
  userCount,
  totalFunds,
  competitionCount,
  gameCount,
  avgGamePerCompetition,
  transactionCount,
  avgTransactionCountPerAddress,
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.grid} container spacing={2}>
      <Grid item xs={12} lg={4}>
        <Paper className={classes.mainmetric}>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {totalFunds} Eth comitted
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {transactionCount} tx(s)
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {avgTransactionCountPerAddress} tx(s)/address
            </Typography>
          </div>
        </Paper>
      </Grid>

      <Grid item  xs={12} lg={4}>
        <Paper className={classes.mainmetric}>
          <div className={classes.gridItem}>
            <PersonIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {userCount} users
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {transactionCount} tx(s)
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {avgTransactionCountPerAddress} tx(s)/address
            </Typography>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Paper className={classes.mainmetric}>
          <div className={classes.gridItem}>
            <PlayArrowIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {competitionCount} competitions
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <SportsEsportsIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {gameCount} games
            </Typography>
          </div>
          <div className={classes.gridItem}>
            <TrendingUpIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              Avg {avgGamePerCompetition} games/competition
            </Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MainMetrics;
