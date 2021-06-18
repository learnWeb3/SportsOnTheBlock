import React from "react";
import BetButtonBar from "../../BetButtonBar";
import GamePanel from "../../GamePanel";

const CardHeader = ({ teamA, teamB, datetime, draw, competition }) => {
  return (
    <>
      <GamePanel
        competition={competition}
        teamA={teamA}
        teamB={teamB}
        datetime={datetime}
      />
      <BetButtonBar teamA={teamA} teamB={teamB} draw={draw} />
    </>
  );
};

export default CardHeader;
