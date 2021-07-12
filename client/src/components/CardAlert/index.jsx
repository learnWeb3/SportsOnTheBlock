import React, { useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  root: {
    transition: "opacity 1s ease-in-out",
    width: "90%",
    marginBottom: 16
  },
  opacity0: {
    opacity: 0,
  },
  opacity1: {
    opacity: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
}));
const CardAlert = ({ message, autoUnmount, unmountTimeout, absolute }) => {
  const classes = useStyles();
  const [opacity, setOpacity] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setOpacity(true);
    }, 1000);

    autoUnmount &&
      unmountTimeout &&
      setTimeout(() => {
        setOpacity(false);
      }, unmountTimeout);
  }, []);
  return (
    <Alert
      id="alert"
      severity={"success"}
      className={clsx(
        classes.root,
        opacity ? classes.opacity1 : classes.opacity0,
        absolute && classes.absolute
      )}
    >
      {message}
    </Alert>
  );
};

export default CardAlert;
