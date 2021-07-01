// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract isCommon {
    struct Bet {
        address user;
        uint256 amount;
        uint256 outcome;
    }
    struct Game {
        string team1Name;
        string team2Name;
        string description;
        string cover;
        uint256 start;
        uint256 team1Score;
        uint256 team2Score;
        uint256 winner;
        bool ended;
        bool started;
    }
    struct Competition {
        string name;
        string description;
        string cover;
        bool available;
    }

    Competition[] competitions;
    uint256 currentGameId;
    uint256 currentCompetitionId;
    mapping(uint256 => Competition) CompetitionIdToCompetition;
    mapping(uint256 => Game[]) CompetitionIdToGames;
    mapping(uint256 => Bet[]) GameIdToBets;
    mapping(uint256 => Game) GameIdToGame;

    event NewGame(Game);
    event NewBet(Bet);
    event NewCompetition(Competition);
    event GameStarted(bool);
    event GameEnded(bool);

    modifier competitionExists(uint256 competitionId) {
        require(
            competitionId > 0 && competitionId <= currentCompetitionId,
            "Competition does not exists"
        );
        _;
    }
    modifier gameExists(uint256 gameId) {
        require(gameId > 0 && gameId <= currentGameId, "Game does not exists");
        _;
    }
    modifier betOutcomeIsValid(uint256 outcome) {
        require(outcome >= 0 && outcome <= 2, "Outcome must be 0, 1, or 2");
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
