import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  menu: {
    height: "100vh",
    position: "fixed",
    backgroundColor: "#FFF",
    zIndex: "100",
    padding: 0,
    top: 0,
    transition: "width .5s ease-in-out",
  },

  menuLeft: {
    left: 0,
  },
  menuRight: {
    right: 0,
  },

  menuCLosed: {
    width: 0,
  },
  menuToogledSm: {
    width: "75vw",
  },
  menuToogledLg: {
    width: "33vw",
  },
  buttonShow: {
    display: "static",
  },
  buttonHidden: {
    display: "none",
  },
  button: {
    top: 16,
    left: 16,
    position: "absolute",
  },
}));

const Menu = ({ menuContent, toogled, setToogled, left }) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div
      className={clsx(
        left ? classes.menuLeft : classes.menuRight,
        classes.menu,
        toogled
          ? matches
            ? classes.menuToogledSm
            : classes.menuToogledLg
          : classes.menuClosed
      )}
    >
      <Close
        fontSize="large"
        className={clsx(
          classes.button,
          toogled ? classes.buttonShow : classes.buttonHidden
        )}
        onClick={() => setToogled(!toogled)}
      />

      {toogled && (
        <Typography variant="h6" component="p">
          {menuContent}
        </Typography>
      )}
    </div>
  );
};

export default Menu;
