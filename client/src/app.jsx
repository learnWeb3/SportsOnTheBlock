import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
import EthProviderContext from "./context/EthProviderContext";
import Home from "./pages/Home/index.jsx";
import Faq from "./pages/Faq/index.jsx";
import Dashboard from "./pages/Dashboard";
import ComponentState from "./hoc/ComponentState";

const App = () => {
  const [Ethprovider, setEthProvider] = useState();
  const [favorites, setFavorites] = useState();
  const handleNewFavorite = (newFavorites) => {
    setFavorites(newFavorites);
  };
  useEffect(() => {
    const getAndSetEthProvider = async () => {
      const provider = await detectEthereumProvider();
      provider && setEthProvider(provider);
    };
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
    getAndSetEthProvider();
    getAndSetLocalFavorites();
  }, []);

  return (
    <EthProviderContext.Provider value={Ethprovider}>
      <Router>
        <Switch>
          <Route exact path="/faq">
            <Faq />
          </Route>
          <Route exact path="/analytics">
            {favorites && (
              <ComponentState
                component={Dashboard}
                setFavorites={(newFavorites) => handleNewFavorite(newFavorites)}
                favorites={favorites}
              />
            )}
          </Route>
          <Route exact path="/">
            {favorites && (
              <ComponentState
                component={Home}
                setFavorites={(newFavorites) => handleNewFavorite(newFavorites)}
                favorites={favorites}
              />
            )}
          </Route>
        </Switch>
      </Router>
    </EthProviderContext.Provider>
  );
};

export default App;
