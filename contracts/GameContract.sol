pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./IsCommon.sol";
import "./BetContract.sol";

contract GameContract is IsCommon {
    // PUBLIC
    constructor(
        string memory teamAName,
        string memory teamBName,
        string memory _description,
        uint256 _start,
        address _admin
    ) public {
        // setting isCommon storage admin variable
        admin = _admin;
        // create new BetContract with reference to the current GameContract;
        address currentAdmin = getAdmin();
        BetContract newBetContract =
            new BetContract(address(this), currentAdmin);

        // storing game data in storage
        game = Game({
            teamA: Team({name: teamAName, score: 0}),
            teamB: Team({name: teamBName, score: 0}),
            description: _description,
            start: _start,
            gameState: GAMESTATES.INCOMING,
            betContractAddress: address(newBetContract),
            gameOutcome: GAMEOUTCOMES.NULL
        });
    }

    // getters

    function getAdmin() public view returns (address) {
        return admin;
    }

    // EXTERNAL

    function getGame() external view returns (Game memory) {
        return game;
    }

    // setters
    function setScore(string calldata _name, uint32 newScore)
        external
        isAdmin()
    {
        if (keccak256(bytes(game.teamA.name)) == keccak256(bytes(_name))) {
            game.teamA.score = newScore;
            setGameOutcome();
            emit GameScoreChanged(game.teamA);
        } else if (
            keccak256(bytes(game.teamB.name)) == keccak256(bytes(_name))
        ) {
            game.teamB.score = newScore;
            setGameOutcome();
            emit GameScoreChanged(game.teamB);
        } else {
            revert("Team name is not valid");
        }
    }

    // setters admin

    // set GameContract gameState TO ENDED decide on game outcome and pay winners bets
    function settleGame() external isAdmin() {
        game.gameState = GAMESTATES.ENDED;
        setGameOutcome();
        BetContract betContract = BetContract(game.betContractAddress);
        betContract.setBetStateTo_TOPAY(msg.sender);
        betContract.settleBet(game.gameOutcome, msg.sender);
        betContract.setBetStateTo_PAYED(msg.sender);
        emit GameStateChanged(game.gameState);
    }

    // set GameContract gameState TO PLAYING and set betContract betState to CLOSE
    function closeBets() external isAdmin() {
        game.gameState = GAMESTATES.PLAYING;
        BetContract betContract = BetContract(game.betContractAddress);
        betContract.setBetStateTo_CLOSE(msg.sender);
        emit GameStateChanged(game.gameState);
    }

    //PRIVATE

    // find game outcome
    function getGameOutcome(uint256 teamAScore, uint256 teamBScore)
        private
        view
        isAdmin()
        returns (GAMEOUTCOMES)
    {
        if (teamAScore > teamBScore) {
            return GAMEOUTCOMES.TEAMA;
        } else if (teamBScore > teamAScore) {
            return GAMEOUTCOMES.TEAMB;
        } else {
            return GAMEOUTCOMES.NULL;
        }
    }

    // set game outcome
    function setGameOutcome() private {
        game.gameOutcome = getGameOutcome(game.teamA.score, game.teamB.score);
    }
}
