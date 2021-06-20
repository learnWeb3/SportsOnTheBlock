import React from "react";
import CardContent from "@material-ui/core/CardContent";
import BetButtonBar from "../../BetButtonBar";
import GamePanel from "../../GamePanel/index";

const CardHeader = ({ game, competition }) => {
  return (
    <CardContent>
      <GamePanel game={game} competition={competition} />
      <BetButtonBar marginTop={true} game={game} />
    </CardContent>
  );
};

export default CardHeader;
