import React from "react";
import { CardMedia, Grid, Typography } from "@material-ui/core";
import ImagePlaceholder from "../../icons/ImagePlaceholder";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaLoaded } from "../../../hooks";

const useStyles = makeStyles((theme) => ({
  media: {
    padding: "1rem",
    margin: "auto",
    width: "unset",
    maxHeight: "6rem",
  },
  versus: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    "& h6": {
      fontWeight: "800",
    },
  },
}));
const GameCardMedia = ({
  game: { team1Logo, team2Logo, team1Name, team2Name },
}) => {
  // access component hook to check wether image is loaded
  const { media1, media2, mediaLoaded } = useMediaLoaded([
    team1Logo,
    team2Logo,
  ]);
  const classes = useStyles();
  return (
    <>
      {mediaLoaded ? (
        <Grid container spacing={4}>
          <Grid item xs={5}>
            <CardMedia
              ref={media1}
              src={team1Logo}
              component="img"
              className={classes.media}
              title={team1Name}
            />
          </Grid>
          <Grid item xs={2} className={classes.versus}>
            <Typography variant="h6" component="p">
              vs
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <CardMedia
              ref={media2}
              src={team2Logo}
              component="img"
              className={classes.media}
              title={team2Name}
            />
          </Grid>
        </Grid>
      ) : (
        <ImagePlaceholder rounded={true} height={"100%"} width={"100%"} />
      )}
    </>
  );
};

export default GameCardMedia;
