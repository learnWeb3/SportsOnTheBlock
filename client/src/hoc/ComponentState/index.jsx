import React, { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import LoadingAnimation from "../../components/LoadingAnimation/index";
import Error from "../../components/Error/index";
import Navbar from "../../components/NavBar/index";



const ComponentState = ({ component: Component, ...props }) => {
  const [provider, setProvider] = useState();
  const [state, setState] = useState({
    status: "loaded",
    code: null,
  });

  useEffect(() => {
    const getAndSetProvider = async () => {
      if (process.env.NODE_ENV == "developement") {
        setProvider(new Web3("http://localhost:8545"));
      } else {
        const provider = await detectEthereumProvider();
        if (provider) {
          setProvider(provider);
        } else {
          setState({ status: "error", code: 499 });
        }
      }
    };

    getAndSetProvider();
  }, []);

  return (
    <>
      <Navbar menuRightDisplayed={false} />

      {state.status === "loading" && <LoadingAnimation />}
      {state.status == "error" && <Error code={state.code} />}
      {state.status !== "loading" && state.status !== "error" && (
        <Component setState={setState} {...props} />
      )}
    </>
  );
};

export default ComponentState;
