pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract IsCommon {
    // Game outcomes to decide on who won the game
    enum GAMEOUTCOMES {TEAMA, TEAMB, NULL}

    // Game states to decide on the current status of the game
    enum GAMESTATES {PLAYING, INCOMING, ENDED}

    // data model to represent team
    struct Team {
        string name;
        uint32 score;
    }

    // data model to represent a Game
    struct Game {
        Team teamA;
        Team teamB;
        uint256 start;
        string description;
        address betContractAddress;
        // Game states to close and settle bets
        GAMESTATES gameState;
        GAMEOUTCOMES gameOutcome;
    }

    // storage game
    Game game;
    // storage admin
    address admin;

    // EVENTS
    event GameStateChanged(GAMESTATES);
    event GameScoreChanged(Team);

    // requiring admin rights
    modifier isAdmin() {
        require(
            msg.sender == admin,
            "You need admin rights to perform this action"
        );
        _;
    }
}
