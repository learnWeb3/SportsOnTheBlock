import React from "react";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import CoinIcon from "../../components/icons/CoinIcon";
import MetamaskIcon from "../../components/icons/MetamaskIcon";
import TrophyIcon from "../../components/icons/TrophyIcon";
import Navbar from "../../components/NavBar";
import PanelIcon from "../../components/PanelIcon";

const useStyles = makeStyles((theme) => ({
  gradient: {
    backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
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
  },
}));

const Faq = () => {
  const classes = useStyles();
  return (
    <>
      <Navbar menuRightDisplayed={false} />
      <div className={classes.gradient}>
        <Container maxWidth="lg">
          <Grid container className={classes.grid}>
            <Typography variant="h2" component="h1">
              Getting started
            </Typography>
            <PanelIcon
              icon={MetamaskIcon}
              title="Metamask Setup"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, qui fugiat optio dolor sed culpa veritatis. Nesciunt repellendus sapiente optio reprehenderit a quae? Similique sed obcaecati tempora voluptates, rerum neque."
              call2ActionExternalLink="https://metamask.io/faqs.html"
              call2ActionLabel="Let's setup Metamask !"
              iconHeight="8rem"
              iconWidth="8rem"
            />
            <PanelIcon
              icon={TrophyIcon}
              title="Place yout bet !"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, qui fugiat optio dolor sed culpa veritatis. Nesciunt repellendus sapiente optio reprehenderit a quae? Similique sed obcaecati tempora voluptates, rerum neque."
              call2ActionLink="/"
              call2ActionLabel="Place my bet !"
              iconHeight="8rem"
              iconWidth="8rem"
            />
            <PanelIcon
              icon={CoinIcon}
              title="Get your rewards !"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, qui fugiat optio dolor sed culpa veritatis. Nesciunt repellendus sapiente optio reprehenderit a quae? Similique sed obcaecati tempora voluptates, rerum neque."
              call2ActionLink="/analytics"
              call2ActionLabel="Check the stats"
              iconHeight="8rem"
              iconWidth="8rem"
            />
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default Faq;
