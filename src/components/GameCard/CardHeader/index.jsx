import React from "react";
import moment from "moment";
import { Container, makeStyles, Typography, Button } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import BetButtonBar from "../../BetButtonBar";

const useStyles = makeStyles((theme) => ({
  gameHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  dark: {
    color: "#212121",
  }
}));

const CardHeader = ({ teamA, teamB, datetime, draw }) => {
  const classes = useStyles();
  return (
    <CardContent>
      <Container className={classes.gameHeader}>
        <Typography
          variant="h6"
          color="textSecondary"
          component="p"
          className={classes.dark}
        >
          {teamA.name.toUpperCase()}-{teamB.name.toUpperCase()}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          component="p"
          className={classes.dark}
        >
          {moment(datetime).format("ddd MM YYYY HH:SS")}
        </Typography>
      </Container>
      <BetButtonBar teamA={teamA} teamB={teamB} draw={draw} />
    </CardContent>
  );
};

export default CardHeader;
