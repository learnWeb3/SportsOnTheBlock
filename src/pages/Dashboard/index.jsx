import React, { useState, useEffect } from "react";

// TEST ONLY
import { gamesMockup } from "../Home/data/games";
import GameCardDashboard from "../../components/GameCardDashBoard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";
import { Container, makeStyles, Grid } from "@material-ui/core";
import Navbar from "../../components/NavBar";

const useStyles = makeStyles((theme) => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
    top: "4rem",
    position: "relative",
  },
}));

const Dashboard = ({ favorites, setFavorites }) => {
  const classes = useStyles();

  const [competitions, setCompetitions] = useState([
    { id: 1, name: "Eurocup" },
    { id: 2, name: "test" },
  ]);
  const [competition, setCompetition] = useState({ id: 1, name: "Eurocup" });
  const [isFilterGameToActive, setFilterGameToActive] = useState(true);
  const [games, setGames] = useState(gamesMockup);

  useEffect(() => {
    // 1- fetchCompetitions
    // 2- setCompetitions
    // 3- set competiton to most valuable one
  });

  useEffect(() => {
    // 1- fetchGames related to competition
    // 2- setGames
  }, [competition]);

  return (
    <div className={classes.gradient}>
      <Navbar
        competition={competition}
        setCompetition={(selectedCompetition) =>
          setCompetition(selectedCompetition)
        }
        competitions={competitions}
        menuRightDisplayed={true}
      />
      <Container maxWidth="lg">
        <MainMetrics
          userCount={10}
          totalFunds={5}
          competitionCount={9}
          gameCount={18}
          avgGamePerCompetition={9}
          transactionCount={200}
          avgTransactionCountPerAddress={3}
        />
        <FiltersArea
          competitions={competitions}
          competition={competition}
          setCompetition={(selectedCompetition) =>
            setCompetition(selectedCompetition)
          }
          isFilterGameToActive={isFilterGameToActive}
          setFilterGameToActive={(isFilterGameToActiveState) =>
            setFilterGameToActive(isFilterGameToActiveState)
          }
        />
        {games?.map((game) => (
          <GameCardDashboard
            favorites={favorites}
            setFavorites={(newFavorites) => setFavorites(newFavorites)}
            key={`game-${game.id}`}
            game={game}
          />
        ))}
      </Container>
    </div>
  );
};

export default Dashboard;
