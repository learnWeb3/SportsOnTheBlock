import React from "react";
import Lottie from "lottie-react";
import LottieLoader from "./json/loader.json";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));
const LoadingAnimation = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Lottie animationData={LottieLoader} />
    </Container>
  );
};

export default LoadingAnimation;
