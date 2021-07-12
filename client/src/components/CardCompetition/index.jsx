import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  makeStyles,
  Typography,
  CardMedia,
  Chip,
} from "@material-ui/core";
import { useMediaLoaded } from "../../hooks";
const useStyles = makeStyles((theme) => ({
  card: {
    padding: 16,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginTop: 8,
  },
  media: {
    height: "4rem",
    width: "4rem",
    margin: "auto",
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
}));

const CardCompetition = ({
  refreshCounter,
  setRefreshCounter,
  isPresentInContract,
  competition,
  oracleContract,
  accounts,
  setAlert,
}) => {
  const classes = useStyles();
  const { mediaLoaded, media } = useMediaLoaded([competition]);
  const handleNewCompetition = async (competitionId) => {
    try {
      const tx = await oracleContract.contract.methods
        .newCompetition(competitionId)
        .send({ from: accounts[0], gas: 100000 });
      if (tx.error) {
        throw new Error(`problem sending transaction`);
      }
      setAlert({
        toogled: true,
        message: "New competition added to contract",
        type: "success",
      });
      setRefreshCounter(refreshCounter + 1);
    } catch (error) {
      console.log(error);
      setAlert({
        toogled: true,
        message: "We encoutered an unexpected error, please try again",
        type: "error",
      });
    }
  };
  return (
    <Grid item xs={12} lg={3}>
      <div className={classes.card}>
        <Chip
          className={classes.badge}
          color={isPresentInContract ? "secondary" : "primary"}
          label={isPresentInContract ? "On The Block" : "Off The Block"}
        />
        <CardMedia
          ref={media}
          src={competition.cover}
          component="img"
          className={classes.media}
          title={`${competition.name}`}
        />
        <CardContent>
          <Typography variant="h6" component="h2">
            {competition.name}
          </Typography>
          {!isPresentInContract && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              size="small"
              onClick={() => handleNewCompetition(competition.id)}
            >
              ADD TO CONTRACT
            </Button>
          )}
        </CardContent>
      </div>
    </Grid>
  );
};

export default CardCompetition;
