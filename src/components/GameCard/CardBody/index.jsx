import React from "react";
import { Container, makeStyles, Typography, Button } from "@material-ui/core";
import clsx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
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
      buttons: {
        width: "30%",
      },
      buttonBar: {
        marginTop: 16,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
      },
      description:{
        marginTop: 16,
      }
}));


const CardBody = ({isFavorite, handleAddFavorite, expanded, handleExpandClick, teamA, description, teamB, draw, id}) =>{

    const classes = useStyles();
    return (
        <>
        <CardActions disableSpacing>
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
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" component="p">DESCRIPTION :</Typography>
          <Typography paragraph className={classes.description}>{description}</Typography>
          <Typography variant="h6" component="p" >CURRENTLY IN THE POT</Typography>
          <Container className={classes.buttonBar}>
            <Button
              className={classes.buttons}
              variant="contained"
              color="secondary"
            >
              {teamA.betValue} ETH
            </Button>
            <Button
              className={classes.buttons}
              variant="contained"
              color="primary"
            >
              {draw.betValue} ETH
            </Button>
            <Button
              className={classes.buttons}
              variant="contained"
              color="secondary"
            >
              {teamB.betValue} ETH
            </Button>
          </Container>
        </CardContent>
      </Collapse>
      </>
    )
}

export default CardBody;