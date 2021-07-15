import { useEffect, useState, useContext, useRef } from "react";
import config from "../config/index.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import LoadingAnimation from "../components/LoadingAnimation/index";
import { ErrorComponent, ErrorPage } from "../components/Error/index";
import Context from "../context/index";

// make web3 provider and accounts available for component using this hook
const useProvider = (setState) => {
  const [provider, setProvider] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  useEffect(() => {
    const getAndSetProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        provider.on("accountsChanged", function (accounts) {
          setSelectedAddress(accounts[0]);
        });

        provider.on("disconnect", function () {
          setState({
            status: "error",
            code: 500,
            message: "Network failure error",
          });
        });
        provider.on("connect", async function () {
          const _accounts = await provider.request({
            method: "eth_requestAccounts",
          });
          setAccounts(_accounts);
          setSelectedAddress(provider.selectedAddress);
        });
        const web3 = new Web3(provider);
        setProvider(web3);
        if (web3) {
          try {
            const _accounts = await provider.request({
              method: "eth_requestAccounts",
            });
            setAccounts(_accounts);
            setSelectedAddress(provider.selectedAddress);
          } catch (error) {
            setState({
              status: "error",
              code: 499,
              message: "Please authorize our app to interact with your wallet",
            });
          }
        }
      } else {
        const web3 = new Web3(config.provider_url);
        setProvider(web3);
        const _accounts = await web3.eth.getAccounts();
        _accounts.length > 0
          ? _accounts.length > 0 &&
            setAccounts(_accounts) &&
            setSelectedAddress(accounts[0])
          : setState({ status: "error", code: 500 });
      }
    };
    getAndSetProvider();
  }, [setState, selectedAddress]);

  return {
    provider,
    setProvider,
    accounts,
    setAccounts,
    selectedAddress,
  };
};

// make available state setState, LoadingAnimation and error to components implementing this hook
const useComponentState = () => {
  const [isModalToogled, setModalToogled] = useState(false);
  const [alert, setAlert] = useState({
    toogled: false,
    message: "",
    type: "error",
  });
  const [state, setState] = useState({
    status: "loaded",
    code: null,
  });

  return {
    alert,
    setAlert,
    setState,
    state,
    isModalToogled,
    setModalToogled,
    LoadingAnimation,
    ErrorPage,
    ErrorComponent,
  };
};

const useMediaLoaded = (dependenciesArr) => {
  const media1 = useRef();
  const media2 = useRef();
  const [mediaLoaded, setMediaLoaded] = useState(true);
  useEffect(() => {
    if (media1 && media2 && media1.current && media2.current) {
      if (
        !media1.current.complete &&
        !media2.current.complete &&
        media1.current.height === 0 &&
        media2.current.height === 0
      ) {
        setMediaLoaded(false);
      }
    }
  }, [...dependenciesArr, media1, media2]);

  return {
    media1,
    media2,
    mediaLoaded,
  };
};

const useFavorites = (id) => {
  const { favorites, setFavorites } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState();

  useEffect(() => {
    if (id) {
      const favoriteId = favorites.find((gameId) => gameId === id);
      favoriteId ? setIsFavorite(true) : setIsFavorite(false);
    }
  }, [id]);

  const handleAddFavorite = (id) => {
    if (!isFavorite) {
      setIsFavorite(true);
      localStorage.setItem("favoriteGames", JSON.stringify([...favorites, id]));
      setFavorites([...favorites, id]);
    } else {
      setIsFavorite(false);
      const newFavorites = favorites.filter((id) => id !== id);
      localStorage.setItem("favoriteGames", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  return {
    favorites,
    setFavorites,
    isFavorite,
    handleAddFavorite,
  };
};

export { useProvider, useComponentState, useMediaLoaded, useFavorites };
