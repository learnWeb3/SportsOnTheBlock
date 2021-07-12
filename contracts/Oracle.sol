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
        uint256 start;
        uint256 team1Score;
        uint256 team2Score;
        uint256 winner;
        bool ended;
        bool started;
        bool exists;
    }
    uint256[] competitions;
    mapping(uint256 => uint256[]) CompetitionIdToGamesIds;
    mapping(uint256 => Bet[]) GameIdToBets;
    mapping(uint256 => Game) GameIdToGame;
    event NewGame(Game);
    event NewBet(Bet, uint256);
    event NewCompetition(uint256);
    event GameStarted(bool);
    event GameEnded(bool);

    modifier competitionExists(uint256 competitionId) {
        bool exists = false;
        for (uint256 i; i < competitions.length; i++) {
            if (competitions[i] == competitionId) {
                exists = true;
            }
        }
        require(exists, "competition does not exists");
        _;
    }

    modifier competitionDoesNotExists(uint256 competitionId) {
        bool exists = false;
        for (uint256 i; i < competitions.length; i++) {
            if (competitions[i] == competitionId) {
                exists = true;
            }
        }
        require(!exists, "competition already exists");
        _;
    }

    modifier gameExists(uint256 gameId) {
        require(GameIdToGame[gameId].exists, "Game does not exists");
        _;
    }

    modifier gameDoesNotExists(uint256 gameId) {
        require(!GameIdToGame[gameId].exists, "Game aleready exists");
        _;
    }

    modifier checkGameState(uint256 gameId) {
        require(
            GameIdToGame[gameId].started == false,
            "game has already started"
        );
        _;
    }

    modifier betOutcomeIsValid(uint256 outcome) {
        require(outcome >= 0 && outcome <= 2, "Outcome is invalid");
        _;
    }

    modifier gameEnded(uint256 gameId) {
        require(GameIdToGame[gameId].ended == true, "game must have ended");
        _;
    }
}
