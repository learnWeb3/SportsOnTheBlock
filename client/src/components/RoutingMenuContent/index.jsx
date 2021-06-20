import React from "react";
import { Typography, List, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import BuildIcon from "@material-ui/icons/Build";
import BarChartIcon from "@material-ui/icons/BarChart";

const useStyles = makeStyles(() => ({
  list: {
    display: "flex",
    flexDirection: "column",
    "& a:hover": {
      transform: "translateY(-2px)",
      color: "#FFF",
    },
  },
  listItem: {
    padding: 16,
    color: "#f4f4f4",
    textDecoration: "none",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
}));
const RoutingMenuContent = () => {
  const classes = useStyles();
  return (
    <List
      className={classes.list}
      component="nav"
      aria-label="secondary mailbox folders"
    >
      <Link className={classes.listItem} to="/">
        <HomeIcon className={classes.icon} />
        <Typography variant="h5" component="span">
          Home
        </Typography>
      </Link>
      <Link className={classes.listItem} to="/analytics">
        <BarChartIcon className={classes.icon} />
        <Typography variant="h5" component="span">
          Analytics
        </Typography>
      </Link>
      <Link className={classes.listItem} to="/faq">
        <BuildIcon className={classes.icon} />
        <Typography variant="h5" component="span">
          Setup Guide
        </Typography>
      </Link>
    </List>
  );
};

export default RoutingMenuContent;
