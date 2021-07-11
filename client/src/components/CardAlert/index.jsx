import React, { useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  root: {
    transition: "opacity 1s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
    width: "90%",
  },
  opacity0: {
    opacity: 0,
  },
  opacity1: {
    opacity: 1,
  },
}));
const CardAlert = ({ message }) => {
  const classes = useStyles();
  const [opacity, setOpacity] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setOpacity(true);
    }, 1000);

    setTimeout(() => {
      setOpacity(false);
    }, 3000);
  }, []);
  return (
    <Alert
      id="alert"
      severity={"success"}
      className={clsx(
        classes.root,
        opacity ? classes.opacity1 : classes.opacity0
      )}
    >
      {message}
    </Alert>
  );
};

export default CardAlert;
