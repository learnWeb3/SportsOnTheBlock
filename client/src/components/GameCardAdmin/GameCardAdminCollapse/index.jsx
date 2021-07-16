import React from "react";
import { Collapse, Grid, Button, makeStyles } from "@material-ui/core";

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

const GameCardAdminCollapse = ({
  competition,
  game: { id, start, team1Name, team2Name, description, cover, started },
  createNewGame,
  setAlert,
  expanded,
}) => {
  const classes = useStyles();
  const handleClick = async () => {
    if (id) {
      try {
        await createNewGame(id, competition.id, start);
        setAlert({
          toogled: true,
          message: "New Game successfully added to the contract",
          type: "success",
        });
      } catch (error) {
        console.log(error);
        setAlert({
          toogled: true,
          message: "Internal error please try again later",
          type: "error",
        });
      }
    }
  };
  const hasStarted = start ? parseInt(start) < Date.now() : false;
  return (
    <Collapse
      className={classes.collapse}
      in={expanded}
      timeout="auto"
      unmountOnExit
    >
      <Grid container spacing={2} className={classes.betStats}>
        <Grid item xs={12}>
          {!hasStarted && (
            <Button
              className={classes.betButton}
              size="large"
              color="secondary"
              variant="contained"
              onClick={handleClick}
            >
              ADD GAME
            </Button>
          )}
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default GameCardAdminCollapse;
