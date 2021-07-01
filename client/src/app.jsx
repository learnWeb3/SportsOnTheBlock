import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Faq from "./pages/Faq/index.jsx";
import Dashboard from "./pages/Dashboard";
import Error from "./components/Error/index";
import Context from "./context/index";
import Navbar from "./components/NavBar/index";

const App = () => {
  // user local favorites
  const [favorites, setFavorites] = useState();
  const handleNewFavorite = (newFavorites) => {
    setFavorites(newFavorites);
  };
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
            <Dashboard />
          </Route>
          <Route path="*">
            <Error code={404} />
          </Route>
        </Switch>
      </Router>
    </Context.Provider>
  );
};

export default App;
