import React, { useContext, useState } from "react";
import EthProviderContext from "../context/EthProviderContext";
import {
  Grid,
  Hidden,
  makeStyles,
  Typography,
  Container,
} from "@material-ui/core";
import GameCard from "../components/GameCard";
import uefaBackground from "./img/euro_fixtures.jpg";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Menu from "../components/Menu";

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
  const [games, setGame] = useState([
    {
      id: 1,
      teamA: {
        name: "france",
        betValue: 20,
      },
      teamB: {
        name: "italie",
        betValue: 30,
      },
      draw: {
        name: "NULL",
        betValue: 15,
      },
      datetime: 1623760046200,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
      media:
        "https://www.leparisien.fr/resizer/D0crrN_z4i0JO15aafuhdjcRHEM=/932x582/arc-anglerfish-eu-central-1-prod-leparisien.s3.amazonaws.com/public/R54W6BQLVACG4DKQOE3KHNOBII.jpg",
    },
    {
      id: 2,
      teamA: {
        name: "allemagne",
        betValue: 15,
      },
      teamB: {
        name: "suède",
        betValue: 15,
      },
      draw: {
        name: "NULL",
        betValue: 15,
      },
      datetime: 1623760046200,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
      media:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRqTkEkYtDLv5AaAbJ8ayVvWrypva3eOAGr3ctLUwfNZHxu3eQEcHnFliJ7vFtGAhdkU&usqp=CAU",
    },
    {
      id: 3,
      teamA: {
        name: "espagne",
        betValue: 15,
      },
      teamB: {
        name: "portugal",
        betValue: 15,
      },
      draw: {
        name: "NULL",
        betValue: 15,
      },
      datetime: 1623760046200,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
      media:
        "https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg):focal(1422x294:1424x292)/origin-imgresizer.eurosport.com/2021/06/03/3145541-64466548-2560-1440.jpg",
    },
  ]);
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
