import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import EthProviderContext from "./context/EthProviderContext";
import Home from "./pages/Home";

const App = () => {
  const [Ethprovider, setEthProvider] = useState();
  const [favorites, setFavorites] = useState();
  const handleNewFavorite = (newFavorites) => {
      setFavorites(newFavorites)
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
      }else{
        localStorage.setItem("favoriteGames", JSON.stringify([]));
        setFavorites([]);
      }
    };
    getAndSetEthProvider();
    getAndSetLocalFavorites();
  }, []);

  return (
    <EthProviderContext.Provider value={Ethprovider}>
      {favorites && (
        <Home
          setFavorites={(newFavorites) => handleNewFavorite(newFavorites)}
          favorites={favorites}
        />
      )}
    </EthProviderContext.Provider>
  );
};

export default App;
