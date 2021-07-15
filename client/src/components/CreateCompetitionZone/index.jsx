import React, { useState, useEffect } from "react";
import { Grid, makeStyles, Typography, Paper } from "@material-ui/core";
import CardCompetition from "../CardCompetition";
import { useComponentState } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: 16,
  },
  label: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "0.00938em",
  },
}));

const CreateCompetitionZone = ({
  refreshCounter,
  setRefreshCounter,
  selectedAddress,
  competitions,
  oracleContract,
  bettingContract,
  setAlert,
}) => {
  const classes = useStyles();
  const [currentContractCompetitionsIds, setCurrentContractCompetitionsIds] =
    useState(null);
  useEffect(() => {
    const fetchAndSetCurrentContractCompetitionsIds = async (
      bettingContract
    ) => {
      const _currentContractCompetitionsIds =
        await bettingContract.contract.methods
          .getCompetitions()
          .call()
          .then((competitionsIds) =>
            competitionsIds.map((competitionId) => parseInt(competitionId))
          );
      setCurrentContractCompetitionsIds(_currentContractCompetitionsIds);
    };
    bettingContract &&
      fetchAndSetCurrentContractCompetitionsIds(bettingContract);
  }, []);
  return (
    <Paper>
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" className={classes.label}>
            Create new competition
          </Typography>
        </Grid>
        {competitions?.map((competition) => {
          return (
            <CardCompetition
              key={competition.id}
              competition={competition}
              oracleContract={oracleContract}
              selectedAddress={selectedAddress}
              setAlert={setAlert}
              isPresentInContract={
                currentContractCompetitionsIds?.includes(competition.id)
                  ? true
                  : false
              }
              setRefreshCounter={setRefreshCounter}
              refreshCounter={refreshCounter}
            />
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CreateCompetitionZone;
