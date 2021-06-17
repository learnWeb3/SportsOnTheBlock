import React from "react";
import { Container, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
  },

  buttonBar: {
    marginTop: 16,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
 
}));

const CardBody = ({
  isFavorite,
  handleAddFavorite,
  expanded,
  handleExpandClick,
  description,
  teamA,
  teamB,
  draw,
  id,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" component="p">
        {description}
      </Typography>
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
    </div>
  );
};

export default CardBody;
