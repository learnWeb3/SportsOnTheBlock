// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Owner.sol";
import "./isCommon.sol";

contract BettingContract is Owner, isCommon {
    constructor() {
        owner = msg.sender;
    }

    function getGame(uint256 gameId) external view returns (Game memory game) {
        return GameIdToGame[gameId];
    }

    function getCompetitions() external view returns (uint256[] memory) {
        return competitions;
    }

    function getGames(uint256 competitionId)
        external
        view
        returns (uint256[] memory games)
    {
        return CompetitionIdToGamesIds[competitionId];
    }

    function getBets(uint256 gameId)
        external
        view
        gameExists(gameId)
        returns (Bet[] memory bets)
    {
        return GameIdToBets[gameId];
    }

    function newCompetition(uint256 competitionId) external isOwner() {
        competitions.push(competitionId);
        emit NewCompetition(competitionId);
    }

    function newGame(
        uint96 gameId,
        uint256 competitionId,
        uint56 start
    ) external gameDoesNotExists(gameId) isOwner() {
        Game memory _game = Game(
            gameId,
            start,
            0,
            0,
            0,
            false,
            false,
            true,
            0,
            0
        );
        GameIdToGame[gameId] = _game;
        CompetitionIdToGamesIds[competitionId].push(_game.id);
        emit NewGame(_game);
    }

    function bet(uint256 gameId, uint256 outcome)
        external
        payable
        gameExists(gameId)
        betOutcomeIsValid(outcome)
        checkGameState(gameId)
    {
        Bet memory newBet = Bet(msg.sender, msg.value, outcome);
        GameIdToBets[gameId].push(newBet);
        UserBetSumByGameAndOutcome[msg.sender][gameId][outcome] += msg.value;
        emit NewBet(newBet, gameId);
    }

    function settleGame(
        uint32 gameId,
        uint32 team1Score,
        uint32 team2Score
    ) external gameExists(gameId) isOwner() {
        (
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum,
            uint32 _winner
        ) = getSettlementData(gameId);
        Game memory _game = GameIdToGame[gameId];
        _game.team1Score = team1Score;
        _game.team2Score = team2Score;
        _game.ended = true;
        _game.started = true;
        _game.winner = _winner;
        _game.loserBetsSum = _loserBetsSum;
        _game.winnerBetsSum = _winnerBetsSum;
        GameIdToGame[gameId] = _game;
        emit GameEnded(true, gameId);
    }

    function claimProfits(uint256 gameId)
        external
        payable
        gameExists(gameId)
        gameEnded(gameId)
    {
        Game memory _game = GameIdToGame[gameId];
        uint256 userInitialBetSumWei = UserBetSumByGameAndOutcome[msg.sender][
            gameId
        ][_game.winner];
        uint256 userProfitsWei = (((((userInitialBetSumWei) * 100) /
            _game.winnerBetsSum) * _game.loserBetsSum) / 100);
        UserBetSumByGameAndOutcome[msg.sender][gameId][_game.winner] = 0;
        uint256 userGains = userProfitsWei + userInitialBetSumWei;
        (bool success, ) = msg.sender.call{value: userGains}("");
        require(success, "gains transfer failed");
    }

    function getUserWinnerBetSum(uint256 gameId)
        external
        view
        gameExists(gameId)
        gameEnded(gameId)
        returns (uint256 profits)
    {
        Game memory _game = GameIdToGame[gameId];
        return UserBetSumByGameAndOutcome[msg.sender][gameId][_game.winner];
    }

    function getUserInitialBetSum(uint256 gameId, uint256 outcome)
        external
        view
        gameExists(gameId)
        returns (uint256 betSum)
    {
        return UserBetSumByGameAndOutcome[msg.sender][gameId][outcome];
    }

    function getWinner(uint32 gameId) private view isOwner() returns (uint32) {
        Game memory _game = GameIdToGame[gameId];
        if (_game.team1Score > _game.team2Score) {
            return 1;
        } else if (_game.team2Score > _game.team1Score) {
            return 2;
        } else {
            return 0;
        }
    }

    function getSettlementData(uint32 gameId)
        private
        view
        returns (
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum,
            uint32 _winner
        )
    {
        _winner = getWinner(gameId);
        for (uint256 i = 0; i < GameIdToBets[gameId].length; i++) {
            if (GameIdToBets[gameId][i].outcome == _winner) {
                _winnerBetsSum += GameIdToBets[gameId][i].amount;
            } else {
                _loserBetsSum += GameIdToBets[gameId][i].amount;
            }
        }

        return (_winnerBetsSum, _loserBetsSum, _winner);
    }
}
