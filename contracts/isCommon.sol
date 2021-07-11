// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract isCommon {
    struct Bet {
        address user;
        uint256 amount;
        uint256 outcome;
    }
    struct Game {
        uint256 id;
        string team1Name;
        string team2Name;
        uint256 start;
        uint256 team1Score;
        uint256 team2Score;
        uint256 winner;
        bool ended;
        bool started;
        bool exists;
    }
    struct Competition {
        uint256 id;
        string name;
        bool available;
        bool exists;
    }

    Competition[] competitions;
    mapping(uint256 => Competition) CompetitionIdToCompetition;
    mapping(uint256 => Game[]) CompetitionIdToGames;
    mapping(uint256 => Bet[]) GameIdToBets;
    mapping(uint256 => Game) GameIdToGame;

    event NewGame(Game);
    event NewBet(Bet, uint256);
    event NewCompetition(Competition);
    event GameStarted(bool);
    event GameEnded(bool);

    modifier competitionExists(uint256 competitionId) {
        require(
            CompetitionIdToCompetition[competitionId].exists,
            "Competition does not exists"
        );
        _;
    }
    modifier gameExists(uint256 gameId) {
        require(GameIdToGame[gameId].exists, "Game does not exists");
        _;
    }
    modifier betOutcomeIsValid(uint256 outcome) {
        require(outcome >= 0 && outcome <= 2, "Outcome is invalid");
        _;
    }

    modifier checkGameState(uint256 gameId) {
        require(
            GameIdToGame[gameId].started == false,
            "game has already started"
        );
        _;
    }
}
