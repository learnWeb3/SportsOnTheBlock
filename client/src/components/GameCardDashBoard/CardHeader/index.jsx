import React from "react";
import BetButtonBar from "../../BetButtonBar";
import GamePanel from "../../GamePanel";

const CardHeader = ({game, competition}) => {
  return (
    <>
      <GamePanel
        competition={competition}
        game={game}
      />
      <BetButtonBar game={game} />
    </>
  );
};

export default CardHeader;
