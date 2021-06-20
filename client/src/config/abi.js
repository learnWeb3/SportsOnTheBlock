import BetContract from "../../../build/contracts/BetContract.json";
import CompetitionContract from "../../../build/contracts/CompetitionContract.json";
import CompetitionFactoryContract from "../../../build/contracts/CompetitionFactoryContract.json";
import GameContract from "../../../build/contracts/GameContract.json";

const ABI = {
  BetContract: BetContract.abi,
  CompetitionContract: CompetitionContract.abi,
  CompetitionFactoryContract: CompetitionFactoryContract.abi,
  GameContract: GameContract.abi,
};

export default ABI;
