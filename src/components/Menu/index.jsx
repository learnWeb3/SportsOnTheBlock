import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    position: "fixed",
    backgroundColor: "#3f51b5",
    zIndex: "100",
    padding: 0,
    top: "4rem",
    transition: "width .5s ease-in-out",
  },
  rootLeft: {
    left: 0,
  },
  rootRight: {
    right: 0,
  },
  rootCLosed: {
    width: 0,
  },
  rootToogledSm: {
    width: "75vw",
  },
  rootToogledLg: {
    width: "33vw",
  },
}));

const Menu = ({
  menuContent: MenuContent,
  toogled,
  setToogled,
  left,
  ...props
}) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div
      className={clsx(
        left ? classes.rootLeft : classes.rootRight,
        classes.root,
        toogled
          ? matches
            ? classes.rootToogledSm
            : classes.rootToogledLg
          : classes.rootClosed
      )}
    >
      {toogled && (
        <Typography variant="h6" component="p">
          <MenuContent {...props} />
        </Typography>
      )}
    </div>
  );
};

export default Menu;
