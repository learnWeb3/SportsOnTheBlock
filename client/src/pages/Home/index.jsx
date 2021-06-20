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
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";

// TEST ONLY
import { gamesMockup } from "./data/games";
import Navbar from "../../components/NavBar";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    backgroundSize: "100% 100%",
    backgroundPosition: "bottom",
    backgroundAttachment: "fixed",
    position: "relative",
    zIndex: 0,
    margin: 0,
    padding: 0,
    minHeight: "75vh",
    width: "100%",
  },
  overlay: {
    width: "100%",
    position: "fixed",
    textAlign: "center",
    top: "4rem",
    zIndex: 1,
    margin: 0,
    padding: 16,
    backgroundAttachment: "fixed",
    background:
      "linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) 75%, #d7e1ec 75%, #d7e1ec 100%)",
  },
  competitonLabel: {
    color: "#FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    "& svg": {
      fontSize: "2rem",
      marginRight: 8,
    },
  },
  scroll: {
    display: "block",
    overflow: "auto",
    height: "90vh",
    paddingLeft: 1,
    paddingRight: 16,
    paddingTop: 0,
    paddingBottom: "5rem",
  },
}));

const Home = ({ favorites, setFavorites, setState }) => {
  const classes = useStyles();
  const [competitions, setCompetitions] = useState([
    {
      id: 1,
      name: "Eurocup",
      cover:
        "https://editorial.uefa.com/resources/0263-10dff08e7ac1-a7342e03bf38-1000/euro_date_announcement_2.jpg",
    },
    {
      id: 2,
      name: "Premier League",
      cover:
        "https://e0.365dm.com/21/06/768x432/skysports-premier-league-fixtures_5415976.jpg?20210615153658",
    },
  ]);
  const [competition, setCompetition] = useState({
    id: 1,
    name: "Eurocup",
    cover:
      "https://editorial.uefa.com/resources/0263-10dff08e7ac1-a7342e03bf38-1000/euro_date_announcement_2.jpg",
  });
  const [games, setGame] = useState(gamesMockup);
  const EthProvider = useContext(EthProviderContext);


  return (
    <>
      <Grid
        container
        className={classes.backgroundImage}
        style={{ backgroundImage: `url(${competition.cover})` }}
      >
        <div className={classes.overlay}>
          <Navbar
            competition={competition}
            setCompetition={(selectedCompetition) =>
              setCompetition(selectedCompetition)
            }
            competitions={competitions}
            menuRightDisplayed={true}
          />
          <Container maxWidth="lg">
            <div className={classes.scroll}>
              {games?.map((game) => (
                <GameCard
                  key={`game-${game.id}`}
                  setFavorites={(newFavorites) => setFavorites(newFavorites)}
                  favorites={favorites}
                  game={game}
                  competition={competition}
                />
              ))}
            </div>
          </Container>
        </div>
      </Grid>
    </>
  );
};

export default Home;
