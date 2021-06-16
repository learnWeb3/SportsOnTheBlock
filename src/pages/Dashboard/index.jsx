import React, { useState, useEffect } from "react";

// TEST ONLY
import { gamesMockup } from "../Home/data/games";
import GameCardDashboard from "../../components/GameCardDashBoard";
import FiltersArea from "../../components/FiltersArea";
import MainMetrics from "../../components/MainMetrics";
import { Container, makeStyles } from "@material-ui/core";
import Menu from "../../components/Menu";

const useStyles = makeStyles((theme) => ({
  gradient: {
    backgroundImage:
      "linear-gradient( 109.6deg,  rgba(62,161,219,1) 11.2%, #3f51b5 100.2% )",
  },
}));

const Dashboard = ({ favorites, setFavorites }) => {
  const classes = useStyles();
  const [menuLeftToogled, setMenuLeftToogled] = useState(false);
  const [menuRightToogled, setMenuRightToogled] = useState(false);

  const [competitons, setCompetitions] = useState([
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
      <Menu
        left={true}
        toogled={menuLeftToogled}
        setToogled={setMenuLeftToogled}
      />
      <Menu toogled={menuRightToogled} setToogled={setMenuRightToogled} />

      <Container maxWidth="lg">
        <MainMetrics
          userCount={10}
          totalFunds={5}
          competionCount={9}
          gameCount={18}
          avgGamePerCompetition={9}
        />
        <FiltersArea
          competitions={competitons}
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
