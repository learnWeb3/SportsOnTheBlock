import React from "react";
import {
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  makeStyles,
} from "@material-ui/core";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";

const useStyles = makeStyles(() => ({
  formControl: {
    width: "100%",
    color: "#f4f4f4",
    display: "flex",
    padding: 16,
    textAlign: "left",
    alignItems: "start",
  },
  formGroup: {
    width: "max-content",
    paddingLeft: 0,
  },
  formIconGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    "& svg": {
      width: 32,
      height: 32,
    },
    "& span": {
      color: "#FFF",
      fontWeight: 400,
      lineHeight: 1.334,
      letterSpacing: "0em",
      fontSize: "1.5rem",
    },
  },
}));
const CompetitionFilterMenuContent = ({
  competitions,
  setCompetition,
  competition,
}) => {
  const classes = useStyles();
  const handleChange = (competitionElement) => {
    setCompetition(competitionElement);
  };
  return (
    <FormControl className={classes.formControl}>
      <FormGroup className={classes.formGroup}>
        {competitions?.map((competitionElement) => {
          return (
            <div className={classes.formIconGroup}>
              <SportsSoccerIcon />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={competitionElement.id === competition.id ? true : false}
                    onChange={() => handleChange(competitionElement)}
                    name={competitionElement.name}
                  />
                }
                label={competitionElement.name}
                labelPlacement="start"
              />
            </div>
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default CompetitionFilterMenuContent;
