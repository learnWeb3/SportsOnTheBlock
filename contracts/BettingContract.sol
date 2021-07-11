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
    ) external isOwner() {
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
        CompetitionIdToGamesIds[competitionId].push(_game.id);
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

    function getUserBets(uint256 gameId)
        internal
        view
        gameExists(gameId)
        returns (Bet[] memory _userBets, uint256 _userBetsLen)
    {
        for (uint256 index = 0; index < GameIdToBets[gameId].length; index++) {
            if (GameIdToBets[gameId][index].user == msg.sender) {
                _userBets[_userBetsLen] = GameIdToBets[gameId][index];
                _userBetsLen++;
            }
        }
        return (_userBets, _userBetsLen);
    }

    function getUserProfits(uint256 gameId)
        external
        view
        returns (
            uint256 dueProfits,
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum
        )
    {
        (Bet[] memory _userBets, uint256 _userBetsLen) = getUserBets(gameId);
        require(
            _userBetsLen > 0,
            "User does not have bets related to this game"
        );
        uint256 winner = getWinner(gameId);
        (_winnerBetsSum, _loserBetsSum) = getSettlementData(
            GameIdToBets[gameId],
            winner
        );
        for (uint256 index = 0; index < _userBetsLen; index++) {
            if (_userBets[index].outcome == winner) {
                dueProfits += _userBets[index].amount;
            }
        }

        return (dueProfits, _winnerBetsSum, _loserBetsSum);
    }

    function claimProfits(uint256 gameId) external payable gameExists(gameId) {
        (
            uint256 dueProfits,
            uint256 _winnerBetsSum,
            uint256 _loserBetsSum
        ) = this.getUserProfits(gameId);
        require(dueProfits > 0, "no profits to send");
        payable(msg.sender).transfer(
            _loserBetsSum * ((dueProfits * 100) / _winnerBetsSum)
        );
    }

    function getSettlementData(Bet[] memory _bets, uint256 winner)
        private
        pure
        returns (uint256 _winnerBetsSum, uint256 _loserBetsSum)
    {
        for (uint256 i = 0; i < _bets.length; i++) {
            if (_bets[i].outcome == winner) {
                _winnerBetsSum += _bets[i].amount;
            } else {
                _loserBetsSum += _bets[i].amount;
            }
        }

        return (_winnerBetsSum, _loserBetsSum);
    }
}
