import React from "react";
import ethereum from "./img/coin.png";

const CoinIcon = ({height, width}) => {
  return <img src={ethereum} alt="ethereum logo" style={{height: height, width: width}} />;
};

export default CoinIcon;
