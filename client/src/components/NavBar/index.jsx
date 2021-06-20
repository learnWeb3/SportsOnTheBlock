import React, { useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import Menu from "../../components/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import RoutingMenuContent from "../RoutingMenuContent";
import CompetitionFilterMenuContent from "../CompetitonFilterMenuContent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#3f51b5",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 200,
    "& svg": {
      fontSize: "2rem",
      color: "#FFF",
      cursor: "pointer",
      transition: "transform .2s ease-in-out",
    },
    "& svg:hover": {
      transform: "translateY(-2px)",
    },
  },
}));

const Navbar = ({
  competition,
  setCompetition,
  competitions,
  menuRightDisplayed,
}) => {
  const classes = useStyles();
  const [menuLeftToogled, setMenuLeftToogled] = useState(false);
  const [menuRightToogled, setMenuRightToogled] = useState(false);

  return (
    <>
      <Container maxWidth="xl" className={classes.root}>
        <MenuIcon onClick={() => setMenuLeftToogled(!menuLeftToogled)} />

        {menuRightDisplayed && (
          <SearchIcon onClick={() => setMenuRightToogled(!menuRightToogled)} />
        )}
      </Container>

      <Menu
        left={true}
        toogled={menuLeftToogled}
        setToogled={setMenuLeftToogled}
        menuContent={RoutingMenuContent}
      />

      {menuRightDisplayed && (
        <Menu
          menuContent={CompetitionFilterMenuContent}
          toogled={menuRightToogled}
          setToogled={setMenuRightToogled}
          competition={competition}
          setCompetition={(selectedCompetition) =>
            setCompetition(selectedCompetition)
          }
          competitions={competitions}
        />
      )}
    </>
  );
};

export default Navbar;
