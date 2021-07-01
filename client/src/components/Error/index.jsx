import React from "react";
import { Typography, Container } from "@material-ui/core";
import MetamaskIcon from "../icons/MetamaskIcon";
import PageNotFound from "../icons/PageNotFound";
import ServerError from "../icons/ServerError";
import Forbidden from "../icons/Forbidden";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: "4rem"
  },
  errorCode: {
    marginTop: 16,
  },
}));

const Error = ({ code }) => {
  console.log(code)
  const classes = useStyles();
  const mapCodeToMessage = {
    404: {
      message: "Page not found !",
      illustration: <PageNotFound height="20rem" />,
    },
    403: {
      message: "Forbidden !",
      illustration: <Forbidden height="20rem" />,
    },
    499: {
      message: "Please install Metamask !",
      illustration: <MetamaskIcon height="10rem" />,
    },
    500: {
      message: "Internal Server Error",
      illustration: <ServerError height="20rem" />,
    },
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      {mapCodeToMessage[code].illustration}
      <Typography variant="h6" component="h6" className={classes.errorCode}>
        {mapCodeToMessage[code].message}
      </Typography>
    </Container>
  );
};

export default Error;
