import React from "react";
import trophy from "./img/trophy.png";

const TrophyIcon = ({height, width}) => {
  return <img src={trophy} alt="trophy icon" style={{height: height, width: width}} />;
};

export default TrophyIcon;
