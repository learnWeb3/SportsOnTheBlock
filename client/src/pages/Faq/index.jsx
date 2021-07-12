import React from "react";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import CoinIcon from "../../components/icons/CoinIcon";
import MetamaskIcon from "../../components/icons/MetamaskIcon";
import TrophyIcon from "../../components/icons/TrophyIcon";
import Navbar from "../../components/NavBar";
import PanelIcon from "../../components/PanelIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFF",
    top: "4rem",
    position: "relative",
    minHeight: "90vh",
  },
  grid: {
    minHeight: "90vh",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    paddingBottom: 16,
    "& h1": {
      marginTop: 16,
      marginBottom: 16,
    },
  },
  title: {
    width: "100%",
    textAlign: "center",
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    "& h1": {
      fontWeight: 400,
    },
  },
}));

const Faq = () => {
  const classes = useStyles();
  return (
    <>
      <Navbar menuRightDisplayed={false} />
      <div className={classes.root}>
        <Container maxWidth="lg">
          <Grid container className={classes.grid}>
            <Typography variant="h2" component="h1">
              Getting started
            </Typography>
            <PanelIcon
              icon={MetamaskIcon}
              title="Metamask Setup"
              text="In order to access the platform and be able to interact with the contracts deployed on the Ethereum Network you need to install the Metamask wallet extension available in your favorites browser extensions marketplace."
              infoLink={{label: "What is a wallet ?", url: ""}}
              call2ActionExternalLink="https://metamask.io/faqs.html"
              call2ActionLabel="install metamask"
              iconHeight="8rem"
              iconWidth="8rem"
            />
            <PanelIcon
              icon={TrophyIcon}
              title="Place yout bet !"
              text="Nothing is easier than placing a bet on SportOnTheBlock, you just have to select the game you ar intersted in and click on the button PLACE A BET, on popup will appear offering you the possibility to choose your side and the amount you want to bet."
              infoLink={{label: "What is the Blockchain technology ?", url: ""}}
              call2ActionLink="/"
              call2ActionLabel="Place my bet !"
              iconHeight="10rem"
              iconWidth="8rem"
            />
            <PanelIcon
              icon={CoinIcon}
              title="Get your rewards !"
              text="As soon as we get the end results of a game our Oracle service will update the game with the score and you will be able to get your gains in the following hour."
              infoLink={{label: "What is an Oracle ?", url: ""}}
              call2ActionLink="/analytics"
              call2ActionLabel="Check the stats"
              iconHeight="12rem"
              iconWidth="8rem"
            />
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default Faq;
