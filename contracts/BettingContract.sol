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

    function getCompetitions() external view returns (Competition[] memory) {
        return competitions;
    }

    function getGames(uint256 competitionId)
        external
        view
        competitionExists(competitionId)
        returns (Game[] memory games)
    {
        return CompetitionIdToGames[competitionId];
    }

    function getBets(uint256 gameId)
        external
        view
        gameExists(gameId)
        returns (Bet[] memory bets)
    {
        return GameIdToBets[gameId];
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

    // costly 3 writes in storage
    function newCompetition(uint256 competitionId, string calldata name)
        external
        isOwner()
    {
        Competition memory _competition = Competition(
            competitionId,
            name,
            true,
            true
        );
        CompetitionIdToCompetition[competitionId] = _competition;
        competitions.push(_competition);
        emit NewCompetition(_competition);
    }

    // costly 3 writes in storage
    function newGame(
        uint256 gameId,
        uint256 competitionId,
        uint256 start,
        string calldata team1Name,
        string calldata team2Name
    ) external competitionExists(competitionId) isOwner() {
        Game memory _game = Game(
            gameId,
            team1Name,
            team2Name,
            start,
            0,
            0,
            0,
            false,
            false,
            true
        );
        GameIdToGame[gameId] = _game;
        CompetitionIdToGames[competitionId].push(_game);
        emit NewGame(_game);
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
        require(GameIdToGame[gameId].ended, "Game must have ended");
        uint256 winner = getWinner(gameId);
        Bet[] memory _bets = GameIdToBets[gameId];
        (
            Bet[] memory _winnerBets,
            ,
            uint256 _winnerBetsSum,
            ,
            ,
            uint256 _loserBetsSum
        ) = getSettlementData(_bets, winner);

        for (uint256 i = 0; i < _winnerBets.length; i++) {
            Bet memory _bet = _winnerBets[i];
            uint256 _profit = _loserBetsSum *
                ((_bet.amount * 100) / _winnerBetsSum);
            payable(_bet.user).transfer(_bet.amount + _profit);
        }
        emit GameEnded(true);
    }

    function getWinner(uint256 gameId)
        private
        view
        isOwner()
        gameExists(gameId)
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

    function getSettlementData(Bet[] memory _bets, uint256 winner)
        private
        pure
        returns (
            Bet[] memory _winnerBets,
            uint256 _winnerBetsCount,
            uint256 _winnerBetsSum,
            Bet[] memory _loserBets,
            uint256 _loserBetsCount,
            uint256 _loserBetsSum
        )
    {
        for (uint256 i = 0; i < _bets.length; i++) {
            if (_bets[i].outcome == winner) {
                _winnerBets[_winnerBetsCount] = _bets[i];
                _winnerBetsCount++;
                _winnerBetsSum += _bets[i].amount;
            } else {
                _loserBets[_loserBetsCount] = _bets[i];
                _loserBetsCount++;
                _loserBetsSum += _bets[i].amount;
            }
        }

        return (
            _winnerBets,
            _winnerBetsCount,
            _winnerBetsSum,
            _loserBets,
            _loserBetsCount,
            _loserBetsSum
        );
    }
}
