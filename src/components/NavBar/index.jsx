import React, { useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import Menu from "../../components/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

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

const Navbar = () => {
  const classes = useStyles();
  const [menuLeftToogled, setMenuLeftToogled] = useState(false);
  const [menuRightToogled, setMenuRightToogled] = useState(false);
  return (
    <>
      <Container maxWidth="xl" className={classes.root}>
        <MenuIcon
          onClick={() => setMenuLeftToogled(!menuLeftToogled)}
        />

        <SearchIcon
          onClick={() => setMenuRightToogled(!menuRightToogled)}
        />
      </Container>

      <Menu
        left={true}
        toogled={menuLeftToogled}
        setToogled={setMenuLeftToogled}
      />
      <Menu toogled={menuRightToogled} setToogled={setMenuRightToogled} />
    </>
  );
};

export default Navbar;
