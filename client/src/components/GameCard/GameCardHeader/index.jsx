import React from "react";
import moment from "moment";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import { Chip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
}));
const GameCardHeader = ({ game: { started, ended }, competition }) => {
  const classes = useStyles();
  return (
    <div className={classes.cardHeader}>
      <Chip
        className={classes.badge}
        color={started ? "secondary" : "primary"}
        icon={<AccessTimeRoundedIcon />}
        label={moment(parseInt(started + "000")).format("DD/MM/YY HH:SS")}
      />
      <Chip
        className={classes.badge}
        color={started ? "secondary" : "primary"}
        label={ended ? "ended" : started ? "started" : "active"}
      />
      <Chip
        className={classes.badge}
        color={started ? "secondary" : "primary"}
        label={competition?.name}
      />
    </div>
  );
};

export default GameCardHeader;
