import React from "react";
import { Grid, Paper, Typography, makeStyles } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles((theme) => ({
  grid: {
    paddingTop: 16,
    paddingBottom: 16
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mainmetric: {
    padding: 16,
    minHeight: 200,
  },
  icon: {
    fontSize: "2.125rem",
    marginRight: 16,
  },
}));

const MainMetrics = ({
  userCount,
  totalFunds,
  competionCount,
  gameCount,
  avgGamePerCompetition,
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.grid} container spacing={2}>
      <Grid item xs="4">
        <Paper className={classes.mainmetric}>
          <Typography variant="h5" component="h2">
            Total funds: {totalFunds}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs="4">
        <Paper className={classes.mainmetric}>
          <div className={classes.gridItem}>
            <PersonIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {userCount} users
            </Typography>
          </div>
        </Paper>
      </Grid>
      <Grid item xs="4">
        <Paper className={classes.mainmetric}>
          <div className={classes.gridItem}>
            <PlayArrowIcon className={classes.icon} />
            <Typography variant="h5" component="h2">
              {competionCount} competitions
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
              Avg games/competion: {avgGamePerCompetition}
            </Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MainMetrics;
