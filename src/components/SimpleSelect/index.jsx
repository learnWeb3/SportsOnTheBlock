import {
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SimpleSelect = ({
  competitions,
  helperText,
  competition,
  setCompetition,
}) => {
  const classes = useStyles();
  const handleChange = (event) => {
    setCompetition(event.target.value);
  };
  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Competions</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={competition}
          onChange={handleChange}
        >
          {competitions.map((menuItem) => (
            <MenuItem
              key={`competitions-${menuItem.id}`}
              id={menuItem.id}
              value={menuItem}
            >
              {menuItem.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </>
  );
};

export default SimpleSelect;
