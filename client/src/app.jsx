import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from './pages/Admin/index';
import Home from "./pages/Home";
import Faq from "./pages/Faq/index.jsx";
import { ErrorPage } from "./components/Error/index";
import Context from "./context/index";
import Navbar from "./components/NavBar/index";

const App = () => {
  // user local favorites
  const [favorites, setFavorites] = useState();
  useEffect(() => {
    const getAndSetLocalFavorites = () => {
      let localFavorites = localStorage.getItem("favoriteGames");
      if (localFavorites) {
        localFavorites = JSON.parse(localFavorites);
        setFavorites(localFavorites);
      } else {
        localStorage.setItem("favoriteGames", JSON.stringify([]));
        setFavorites([]);
      }
    };
    getAndSetLocalFavorites();
  }, []);

  return (
    <Context.Provider value={{ favorites, setFavorites }}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/faq">
            <Faq />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route path="*">
            <ErrorPage code={404} height="90vh" />
          </Route>
        </Switch>
      </Router>
    </Context.Provider>
  );
};

export default App;
