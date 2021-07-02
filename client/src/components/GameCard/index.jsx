import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Context from "../../context/index";
import moment from "moment";
import { server_root_path } from "../../config/index.json";
import { useComponentState } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import {
  CardContent,
  CardMedia,
  Collapse,
  Typography,
  Chip,
  Grid,
  Button,
} from "@material-ui/core";
import capitalize from "capitalize";
import Modal from "../Modal/index";
import BetForm from "../BetForm/index";
import CardActionBar from "../CardActionBar";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import { unique, sum } from "../../utils";


const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    padding: 16,
    justifyContent: "space-between",
    "& h5": {
      fontWeight: 700,
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
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
  collapse: {
    paddingTop: 16,
  },
  cardHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
  gameName: {
    marginBottom: 8,
  },
  betButton: {
    width: "100%",
  },
  betStats: {
    padding: 16,
  },
  textRight: {
    textAlign: "right",
  },
}));

const GameCardDashBoard = ({
  competition,
  bettingContract,
  accounts,
  game: {
    cover,
    description,
    ended,
    started,
    team1Name,
    team1Score,
    team2Name,
    team2Score,
    winner,
    start,
    id,
  },
}) => {
  const classes = useStyles();
  // Access custom hooks to display errors and loading animations
  const {
    state,
    setState,
    Error,
    LoadingAnimation,
    isModalToogled,
    setModalToogled,
  } = useComponentState();
  // 0- check if user favorite the current game
  const { favorites, setFavorites } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState();
  const [bets, setBets] = useState(null);

  useEffect(() => {

    const format = (betValue) => {
      if (betValue > 0) {
        return bettingContract.utils.fromWei(`${betValue}`);
      } else {
        return "0.00";
      }
    };

    const getAndSetBets = async () => {
      const bets = await bettingContract.methods.getBets(id).call();
      const _formattedBets = bets.map(({ amount, outcome, user }) => ({
        amount,
        outcome,
        user,
      }));
      const team1Bets = _formattedBets.filter((bet) => bet.outcome === "1");
      const team2Bets = _formattedBets.filter((bet) => bet.outcome === "2");
      const drawBets = _formattedBets.filter((bet) => bet.outcome === "0");
      const team1BetsValue = team1Bets.length > 0 ? sum(team1Bets) : 0;
      const team2BetsValue = team2Bets.length > 0 ? sum(team2Bets) : 0;
      const drawBetsValue = drawBets.length > 0 ? sum(drawBets) : 0;
      setBets({
        bets: _formattedBets,
        betStats: {
          team1BetsValue: format(team1BetsValue).slice(0,4),
          team2BetsValue: format(team2BetsValue).slice(0,4),
          drawBetsValue: format(drawBetsValue).slice(0,4),
        },
      });
    };
    if (id) {
      const favoriteId = favorites.find((id) => id === id);
      favoriteId ? setIsFavorite(true) : setIsFavorite(false);
      getAndSetBets();
    }
  }, [id, isModalToogled]);

  const handleAddFavorite = (id) => {
    if (!isFavorite) {
      setIsFavorite(true);
      localStorage.setItem("favoriteGames", JSON.stringify([...favorites, id]));
      setFavorites([...favorites, id]);
    } else {
      setIsFavorite(false);
      const newFavorites = favorites.filter((id) => id !== id);
      localStorage.setItem("favoriteGames", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  // 3- Transactions
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
    // setTransactions
  };

  if (state.status === "loading") return <LoadingAnimation />;
  else if (state.status === "loaded") {
    return (
      <>
        <Card className={classes.root}>
          <div className={classes.cardHeader}>
            <Chip
              className={classes.badge}
              color={started ? "secondary" : "primary"}
              icon={<AccessTimeRoundedIcon />}
              label={moment(parseInt(start + "000")).format("DD/MM/YY HH:SS")}
            />
            <Chip
              className={classes.badge}
              color={started ? "secondary" : "primary"}
              label={ended ? "ended" : started ? "started" : "active"}
            />
            <Chip
              className={classes.badge}
              color={started ? "secondary" : "primary"}
              label={competition?.name}
            />
          </div>
          <CardMedia
            image={server_root_path + cover}
            className={classes.media}
            title={`${capitalize(team1Name)} vs ${capitalize(team2Name)}`}
          />
          <CardContent>
            <Typography
              className={classes.gameName}
              variant="h6"
              component="h5"
            >
              {`${capitalize(team1Name)} vs ${capitalize(team2Name)}`}
            </Typography>
            <Typography variant="body1" component="p">
              {description}
            </Typography>
          </CardContent>
          <CardActionBar
            handleAddFavorite={handleAddFavorite}
            isFavorite={isFavorite}
            handleExpandClick={handleExpandClick}
            expanded={expanded}
            gameId={id}
            setModalToogled={setModalToogled}
          />
          <Collapse
            className={classes.collapse}
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <Grid container spacing={2} className={classes.betStats}>
              <Grid item xs={12}>
                <Typography variant="body1" component="p">
                  Current value locked
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="p">
                  {capitalize(team1Name)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="p"
                  className={classes.textRight}
                >
                  {bets?.betStats.team1BetsValue}
                  &nbsp;ETH
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="p">
                  {"Draw"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="p"
                  className={classes.textRight}
                >
                  {bets?.betStats.drawBetsValue}
                  &nbsp;ETH
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="p">
                  {capitalize(team2Name)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="p"
                  className={classes.textRight}
                >
                  {bets?.betStats.team2BetsValue}
                  &nbsp;ETH
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {!started && (
                  <Button
                    className={classes.betButton}
                    size="large"
                    color="secondary"
                    variant="contained"
                    onClick={() => setModalToogled(true)}
                  >
                    place a bet
                  </Button>
                )}
              </Grid>
            </Grid>
          </Collapse>
        </Card>
        {isModalToogled &&
          ReactDOM.createPortal(
            <Modal
              component={BetForm}
              title={`Place a bet on :`}
              buttonLabel="confirm"
              setModalToogled={setModalToogled}
              game={{
                cover,
                description,
                ended,
                started,
                team1Name,
                team1Score,
                team2Name,
                team2Score,
                winner,
                id,
              }}
              bettingContract={bettingContract}
              accounts={accounts}
            />,
            document.querySelector("body")
          )}
      </>
    );
  } else {
    return <Error code={500} />;
  }
};

export default GameCardDashBoard;
