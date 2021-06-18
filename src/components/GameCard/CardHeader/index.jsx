import React from "react";
import moment from "moment";
import { Container, makeStyles, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import BetButtonBar from "../../BetButtonBar";
import CompetitionNamePanel from "../../CompetitionNamePanel";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
}));

const CardHeader = ({ teamA, teamB, datetime, draw, competition }) => {
  const classes = useStyles();
  return (
    <CardContent>
      <Container className={classes.cardHeader}>
        <CompetitionNamePanel competition={competition} />
        <Typography variant="h6" color="dark" component="p">
          {teamA.name.toUpperCase()}-{teamB.name.toUpperCase()}
        </Typography>
        <Typography variant="subtitle1" color="dark" component="p">
          {moment(datetime).format("ddd MM YYYY HH:SS")}
        </Typography>
      </Container>
      <BetButtonBar teamA={teamA} teamB={teamB} draw={draw} />
    </CardContent>
  );
};

export default CardHeader;
