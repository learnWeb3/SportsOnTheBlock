import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  description: {
    marginTop: 16,
  },
  isColorFavorite: {
    color: "red",
  },
  isColorNotFavorite: {
    color: "unset",
  },
}));

const CardBody = ({
  isFavorite,
  handleAddFavorite,
  expanded,
  handleExpandClick,
  game,
}) => {
  const classes = useStyles();
  return (
    <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
        <FavoriteIcon
          className={
            isFavorite ? classes.isColorFavorite : classes.isColorNotFavorite
          }
          onClick={() => handleAddFavorite(game.id)}
        />
      </IconButton>
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
    </CardActions>
  );
};

export default CardBody;
