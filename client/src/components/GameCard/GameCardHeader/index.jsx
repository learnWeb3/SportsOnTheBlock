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
  competition,
  game: { started, ended, start, id },
  userGains,
  newBetPresent,
  cardAlertMessage,
  isPresentInContract,
}) => {
  const classes = useStyles();

  const hasStarted = start ? parseInt(start) < Date.now() : false;

  return (
    <div className={classes.cardHeader}>
      {cardAlertMessage && newBetPresent && (
        <CardAlert
          message={cardAlertMessage}
          autoUnmount={true}
          unmountTimeout={3000}
          absolute={true}
        />
      )}

      {ended && userGains > 0 && (
        <CardAlert
          message={`Congratulations, the odds were in your favor ! Please retrieve your gains: ${userGains} ETH`}
          autoUnmount={false}
        />
      )}

      <Chip className={classes.badge} color={"secondary"} label={`#${id}`} />

      {isPresentInContract && (
        <Chip
          className={classes.badge}
          color={isPresentInContract ? "secondary" : "primary"}
          label={isPresentInContract ? "On The Block" : "Off The Block"}
        />
      )}
      <Chip
        className={classes.badge}
        color={hasStarted ? "secondary" : "primary"}
        icon={<AccessTimeRoundedIcon />}
        label={moment(parseInt(start)).format("DD/MM/YY HH:SS")}
      />
      <Chip
        className={classes.badge}
        color={hasStarted ? "secondary" : "primary"}
        label={ended ? "ended" : hasStarted ? "started" : "active"}
      />
      <Chip
        className={classes.badge}
        color={hasStarted ? "secondary" : "primary"}
        label={competition?.name}
      />
    </div>
  );
};

export default GameCardHeader;
