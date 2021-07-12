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

    function newCompetition(uint256 competitionId)
        external
        competitionDoesNotExists(competitionId)
        isOwner()
    {
        competitions.push(competitionId);
        emit NewCompetition(competitionId);
    }

    function newGame(
        uint256 gameId,
        uint256 competitionId,
        uint256 start
    ) external gameDoesNotExists(gameId) isOwner() {
        Game memory _game = Game(gameId, start, 0, 0, 0, false, false, true);
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
        emit NewBet(newBet, gameId);
    }

    function setGameToStarted(uint256 gameId) external isOwner() {
        GameIdToGame[gameId].started = true;
    }

    function settleGame(
        uint256 gameId,
        uint256 team1Score,
        uint256 team2Score
    ) external gameExists(gameId) isOwner() {
        Game memory _game = GameIdToGame[gameId];
        _game.team1Score = team1Score;
        _game.team2Score = team2Score;
        _game.ended = true;
        GameIdToGame[gameId] = _game;
        emit GameEnded(true);
    }

    function getSettlementData(uint256 gameId)
        external
        view
        gameExists(gameId)
        gameEnded(gameId)
        returns (
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum,
            uint256 userWinnerBetValue,
            uint256 winner
        )
    {
        winner = getWinner(gameId);
        for (uint256 i = 0; i < GameIdToBets[gameId].length; i++) {
            if (GameIdToBets[gameId][i].outcome == winner) {
                _winnerBetsSum += GameIdToBets[gameId][i].amount;
                if (msg.sender == GameIdToBets[gameId][i].user) {
                    userWinnerBetValue += GameIdToBets[gameId][i].amount;
                }
            } else {
                _loserBetsSum += GameIdToBets[gameId][i].amount;
            }
        }

        return (_winnerBetsSum, _loserBetsSum, userWinnerBetValue, winner);
    }

    function claimProfits(uint256 gameId) external payable gameExists(gameId) {
        (
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum,
            uint256 userWinnerBetValue,

        ) = this.getSettlementData(gameId);
        payable(msg.sender).transfer(
            _loserBetsSum * ((userWinnerBetValue * 100) / _winnerBetsSum)
        );
    }

    function getWinner(uint256 gameId)
        private
        view
        isOwner()
        gameExists(gameId)
        gameEnded(gameId)
        returns (uint256)
    {
        Game memory _game = GameIdToGame[gameId];
        if (_game.team1Score > _game.team2Score) {
            return 1;
        } else if (_game.team2Score > _game.team1Score) {
            return 2;
        } else {
            return 0;
        }
    }
}
