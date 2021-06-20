import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    textAlign: "justify",
    marginTop: 16,
  },

  buttonBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
}));

const CardActionBar = ({
  handleAddFavorite,
  isFavorite,
  handleExpandClick,
  expanded,
  id,
}) => {
  const classes = useStyles();
  return (
    <Container className={classes.buttonBar}>
      <IconButton aria-label="add to favorites">
        <FavoriteIcon
          style={{ color: isFavorite ? "red" : "unset" }}
          onClick={() => handleAddFavorite(id)}
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
    </Container>
  );
};

export default CardActionBar;
