import React from "react";
import moment from "moment";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import { Chip, makeStyles } from "@material-ui/core";
import CardAlert from "../../CardAlert/index";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: 16,
    paddingBottom: 16,
    position: "relative",
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
}));
const GameCardHeader = ({
  newBetPresent,
  cardAlertMessage,
  game: { started, ended, start },
  competition,
  isPresentInContract,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.cardHeader}>
      {cardAlertMessage && newBetPresent && (
        <CardAlert message={cardAlertMessage} />
      )}
      {isPresentInContract && (
        <Chip
          className={classes.badge}
          color={isPresentInContract ? "secondary" : "primary"}
          label={isPresentInContract ? "On The Block" : "Off The Block"}
        />
      )}
      <Chip
        className={classes.badge}
        color={started ? "secondary" : "primary"}
        icon={<AccessTimeRoundedIcon />}
        label={moment(parseInt(start)).format("DD/MM/YY HH:SS")}
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
