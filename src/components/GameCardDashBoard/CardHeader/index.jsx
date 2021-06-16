import React from "react";
import moment from "moment";
import { Container, makeStyles, Typography, Button } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
  gameHeader: {
    width: "100%",
    padding: 0,
  },
  dark: {
    color: "#212121",
  },
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

const CardHeader = ({ teamA, teamB, datetime, draw, competition }) => {
  const classes = useStyles();
  return (
    <CardContent>
      <Container className={classes.gameHeader}>
        <Typography
          variant="h5"
          color="textSecondary"
          component="p"
          className={classes.dark}
        >
          {competition.name}
        </Typography>
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
      <Container className={classes.buttonBar}>
          <Button
            className={classes.buttons}
            variant="contained"
            color="secondary"
          >
            {teamA.betValue} ETH
          </Button>
          <Button
            className={classes.buttons}
            variant="contained"
            color="primary"
          >
            {draw.betValue} ETH
          </Button>
          <Button
            className={classes.buttons}
            variant="contained"
            color="secondary"
          >
            {teamB.betValue} ETH
          </Button>
        </Container>
    </CardContent>
  );
};

export default CardHeader;
