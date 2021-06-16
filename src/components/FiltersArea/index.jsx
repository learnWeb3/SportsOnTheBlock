import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import SimpleSelect from "../SimpleSelect";
import ActiveFilters from "./ActiveFilters";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: 16,
  },
}));
const FiltersArea = ({
  competitions,
  competition,
  setCompetition,
  isFilterGameToActive,
  setFilterGameToActive,
}) => {
  const classes = useStyles();

  return (
    <Paper>
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={4}>
          <ActiveFilters
            isFilterGameToActive={isFilterGameToActive}
            setFilterGameToActive={(isFilterGameToActiveState) =>
              setFilterGameToActive(isFilterGameToActiveState)
            }
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <SimpleSelect
            competitions={competitions}
            competition={competition}
            setCompetition={(selectedCompetition) =>
              setCompetition(selectedCompetition)
            }
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersArea;
