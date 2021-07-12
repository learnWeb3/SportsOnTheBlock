import React from "react";
import { Grid, makeStyles, Typography, Button } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
    minHeight: "90vh",
  },
  subject: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    "& h2": {
      marginBottom: 16,
      marginTop: 16,
    },
  },
  subjectLg: {
    alignItems: "flex-start",
  },
  subjectMd: {
    alignItems: "center",
    textAlign: "justify",
  },
  btn: {
    marginTop: 16,
    marginBottom: 16,
  },
  btnLg: {
    width: "100%",
  },
  btnMd: {
    width: "25%",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    "& img": {
      padding: 8,
    },
  },
  surface: {
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  link:{
    marginLeft: 8
  }
}));

const PanelIcon = ({
  icon: Icon,
  title,
  text,
  infoLink,
  call2ActionLink,
  call2ActionLabel,
  call2ActionExternalLink,
  iconHeight,
  iconWidth,
}) => {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:600px)");
  const history = useHistory();
  return (
    <Grid container className={classes.surface}>
      <Grid item sm={12} lg={3} className={classes.alignCenter}>
        <Icon height={iconHeight} width={iconWidth} />
      </Grid>
      <Grid
        item
        sm={12}
        lg={9}
        className={
          matches
            ? clsx(classes.subject, classes.subjectLg)
            : clsx(classes.subject, classes.subjectMd)
        }
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body1" component="p">
          {text}

          <Link
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => history.push(infoLink.url)}
            className={
              classes.link
            }
          >
            {infoLink.label}
          </Link>
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() =>
            call2ActionExternalLink
              ? (window.location.href = call2ActionExternalLink)
              : history.push(call2ActionLink)
          }
          className={
            matches
              ? clsx(classes.btn, classes.btnMd)
              : clsx(classes.btn, classes.btnLg)
          }
        >
          {call2ActionLabel}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PanelIcon;
