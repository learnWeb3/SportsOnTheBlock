import React, { useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import Menu from "../../components/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  gradient: {
    backgroundImage:
      "linear-gradient( 109.6deg,  rgba(62,161,219,1) 11.2%, #3f51b5 100.2% )",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: 0,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [menuLeftToogled, setMenuLeftToogled] = useState(false);
  const [menuRightToogled, setMenuRightToogled] = useState(false);
  return (
    <>
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
