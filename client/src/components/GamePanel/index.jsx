import React from "react";
import moment from "moment";
import { makeStyles, Typography, Hidden, Container } from "@material-ui/core";
import CompetitionNamePanel from "../CompetitionNamePanel";

const useStyles = makeStyles((theme) => ({
  gamePanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cardHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 0,
    "& p": {
      display: "flex",
      alignItems: "center",
    },
  },
  gameNameSm: {
    textAlign: "center",
    marginTop: 16,
    display:"flex",
    alignItems: "center",
    justifyContent:"center"
  },
  teamShield: {
    height: 24,
    width: 24,
    padding: 4,
  },
}));

const GamePanel = ({ competition, game: { teamA, teamB, datetime } }) => {
  const classes = useStyles();
  return (
    <>
      <Hidden mdDown>
        <Container className={classes.cardHeader}>
          <CompetitionNamePanel competition={competition} />
          <Typography variant="h6" color="dark" component="p">
            <img
              className={classes.teamShield}
              src={teamA.shield}
              alt="team shield"
            />
            {teamA.name.toUpperCase()} vs
            <img
              className={classes.teamShield}
              src={teamA.shield}
              alt="team shield"
            />
            {teamB.name.toUpperCase()}
          </Typography>
          <Typography variant="subtitle1" color="dark" component="p">
            {moment(datetime).format("ddd MM YYYY HH:SS")}
          </Typography>
        </Container>
      </Hidden>
      <Hidden mdUp>
        <Container className={classes.cardHeader}>
          <CompetitionNamePanel competition={competition} />
          <Typography variant="subtitle1" color="dark" component="p">
            {moment(datetime).format("ddd MM YYYY HH:SS")}
          </Typography>
        </Container>
        <Typography
          variant="h6"
          color="dark"
          component="p"
          className={classes.gameNameSm}
        >
          <img
            className={classes.teamShield}
            src={teamA.shield}
            alt="team shield"
          />
          {teamA.name.toUpperCase()} vs
          <img
            className={classes.teamShield}
            src={teamA.shield}
            alt="team shield"
          />
          {teamB.name.toUpperCase()}
        </Typography>
      </Hidden>
    </>
  );
};

export default GamePanel;
