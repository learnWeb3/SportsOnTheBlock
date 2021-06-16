import React, { useContext, useState } from "react";
import EthProviderContext from "../../context/EthProviderContext";
import {
  Grid,
  Hidden,
  makeStyles,
  Typography,
  Container,
} from "@material-ui/core";
import GameCard from "../../components/GameCard";
import uefaBackground from "./img/euro_fixtures.jpg";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Menu from "../../components/Menu";

// TEST ONLY
import { gamesMockup } from "./data/games";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    backgroundImage: `url(${uefaBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    zIndex: 0,
    margin: 0,
    padding: 0,
    minHeight: "66vh",
    width: "100%",
  },
  overlay: {
    position: "absolute",
    textAlign: "center",
    top: 0,
    zIndex: 1,
    margin: 0,
    padding: 16,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,1) 66%)",
    backgroundAttachment: "fixed",
  },
  competition: {
    fontWeight: 600,
    color: "#FFF",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: 0,
  },
}));

const Home = ({ favorites, setFavorites }) => {
  const [menuLeftToogled, setMenuLeftToogled] = useState(false);
  const [menuRightToogled, setMenuRightToogled] = useState(false);

  const classes = useStyles();
  const [games, setGame] = useState(gamesMockup);
  const EthProvider = useContext(EthProviderContext);

  return (
    <>
      <Menu
        left={true}
        toogled={menuLeftToogled}
        setToogled={setMenuLeftToogled}
      />
      <Menu toogled={menuRightToogled} setToogled={setMenuRightToogled} />
      <Grid container className={classes.backgroundImage}>
        <Grid container className={classes.overlay}>
          <Container maxWidth="xl" className={classes.iconContainer}>
            <MenuIcon
              fontSize="large"
              style={{ color: "#FFF" }}
              onClick={() => setMenuLeftToogled(true)}
            />

            <SearchIcon
              fontSize="large"
              style={{ color: "#FFF" }}
              onClick={() => setMenuRightToogled(true)}
            />
          </Container>
          <Grid className={classes.grid} item xs={12}>
            <Typography
              className={classes.competition}
              variant="h1"
              component="h1"
            >
              UEFA EURO CUP
            </Typography>
          </Grid>
          <Hidden mdDown>
            <Grid item lg={4}></Grid>
          </Hidden>
          <Grid item xs={12} lg={4}>
            {games?.map((game) => (
              <GameCard
                key={`game-${game.id}`}
                setFavorites={(newFavorites) => setFavorites(newFavorites)}
                favorites={favorites}
                game={game}
              />
            ))}
          </Grid>
          <Hidden mdDown>
            <Grid item lg={4}></Grid>
          </Hidden>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
