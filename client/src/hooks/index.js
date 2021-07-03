import { useEffect, useState } from "react";
import config from "../config";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import LoadingAnimation from "../components/LoadingAnimation/index";
import { ErrorComponent, ErrorPage } from "../components/Error/index";

// make web3 provider and accounts available for component using this hook
const useProvider = (setState) => {
  const [provider, setProvider] = useState();
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    const getAndSetAccounts = async (web3) => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccounts(accounts);
      } else {
        setState({ status: "error", code: 499 });
      }
    };

    const getAndSetProvider = async () => {
      if (process.env.NODE_ENV === "development") {
        const web3 = new Web3(config.provider_url);
        setProvider(web3);
        web3 && getAndSetAccounts(web3);
      } else {
        const provider = await detectEthereumProvider();
        if (provider) {
          const web3 = new Web3(provider);
          setProvider(web3);
          web3 && getAndSetAccounts(web3);
        } else {
          setState({ status: "error", code: 499 });
        }
      }
    };

    getAndSetProvider();
  }, [setState]);

  return {
    provider,
    setProvider,
    accounts,
    setAccounts,
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

export { useProvider, useComponentState };
