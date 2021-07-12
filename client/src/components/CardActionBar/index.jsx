import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActions from "@material-ui/core/CardActions";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "space-between",
  },
}));

const CardActionBar = ({
  gameId,
  isPresentInContract,
  handleAddFavorite,
  isFavorite,
  handleExpandClick,
  expanded,
}) => {
  const classes = useStyles();
  return (
    <CardActions disableSpacing className={classes.root}>
      <IconButton
        aria-label="add to favorites"
        onClick={() => handleAddFavorite(gameId)}
      >
        <FavoriteIcon style={{ color: isFavorite ? "red" : "unset" }} />
      </IconButton>
      {!isPresentInContract && (
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      )}
    </CardActions>
  );
};

export default CardActionBar;
