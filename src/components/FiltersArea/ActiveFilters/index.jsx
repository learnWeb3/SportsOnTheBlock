import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import React from "react";

const ActiveFilters = ({ isFilterGameToActive, setFilterGameToActive }) => {
  console.log(isFilterGameToActive);
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Game State</FormLabel>
      <RadioGroup row aria-label="position" name="position" defaultValue="top">
        <FormControlLabel
          value="end"
          control={<Radio color="primary" />}
          label="active"
          onChange={() => setFilterGameToActive(true)}
          checked={isFilterGameToActive ? "checked" : null}
        />
        <FormControlLabel
          value="end"
          control={<Radio color="primary" />}
          label="settled"
          onChange={() => setFilterGameToActive(false)}
          checked={!isFilterGameToActive ? "checked" : null}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ActiveFilters;
