import React from "react";
import { makeStyles } from "@material-ui/core";
import CardActionBar from "../../CardActionBar";
import GameDescriptionPanel from "../../GameDescriptionPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    textAlign: "justify",
    marginTop: 16,
  }
}));

const CardBody = ({
  isFavorite,
  handleAddFavorite,
  expanded,
  handleExpandClick,
  description,
  id,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GameDescriptionPanel description={description} />
      <CardActionBar
        isFavorite={isFavorite}
        handleAddFavorite={handleAddFavorite}
        expanded={expanded}
        handleExpandClick={handleExpandClick}
        id={id}
      />
    </div>
  );
};

export default CardBody;
