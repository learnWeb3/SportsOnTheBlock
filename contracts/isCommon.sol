// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract isCommon {
    struct Bet {
        address user;
        uint256 amount;
        uint256 outcome;
    }
    struct Game {
        uint96 id;
        uint56 start;
        uint32 team1Score;
        uint32 team2Score;
        uint32 winner;
        bool ended;
        bool started;
        bool exists;
        uint256 winnerBetsSum;
        uint256 loserBetsSum;
    }
    uint256[] competitions;
    mapping(uint256 => uint256[]) CompetitionIdToGamesIds;
    mapping(uint256 => Bet[]) GameIdToBets;
    mapping(uint256 => Game) GameIdToGame;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) UserBetSumByGameAndOutcome;
    event NewGame(Game);
    event NewBet(Bet, uint256);
    event NewCompetition(uint256);
    event GameStarted(bool, uint256);
    event GameEnded(bool, uint256);

    modifier gameExists(uint256 gameId) {
        require(GameIdToGame[gameId].exists, "Game does not exists");
        _;
    }

    modifier gameDoesNotExists(uint256 gameId) {
        require(!GameIdToGame[gameId].exists, "Game aleready exists");
        _;
    }
    modifier betOutcomeIsValid(uint256 outcome) {
        require(outcome >= 0 && outcome <= 2, "Outcome is invalid");
        _;
    }

    modifier checkGameState(uint256 gameId) {
        require(
            block.timestamp * 1000 < GameIdToGame[gameId].start,
            "game has already started"
        );
        _;
    }
    modifier gameEnded(uint256 gameId) {
        require(GameIdToGame[gameId].ended == true, "game must have ended");
        _;
    }
}
