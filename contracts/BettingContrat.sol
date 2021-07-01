// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Owner.sol";
import "./isCommon.sol";

contract BettingContract is Owner, isCommon {
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
        require(gameId > 0 && gameId <= currentGameId, "Game does not exists");
        return GameIdToBets[gameId];
    }

    function bet(uint256 gameId, uint256 outcome)
        external
        payable
        gameExists(gameId)
        betOutcomeIsValid(outcome)
        checkGameState(gameId)
    {
        GameIdToBets[gameId].push(Bet(msg.sender, msg.value, outcome));
    }

    // costly 3 writes in storage
    function newCompetition(
        string calldata name,
        string calldata description,
        string calldata cover
    ) external {
        Competition memory _competition = Competition(
            name,
            description,
            cover,
            true
        );
        CompetitionIdToCompetition[currentCompetitionId] = _competition;
        competitions.push(_competition);
        currentCompetitionId++;
        emit NewCompetition(_competition);
    }

    // costly 3 writes in storage
    function newGame(
        uint256 competitionId,
        string calldata team1Name,
        string calldata team2Name,
        string calldata description,
        string calldata cover
    ) external competitionExists(competitionId) isOwner() {
        Game memory _game = Game(
            team1Name,
            team2Name,
            description,
            cover,
            0,
            0,
            0,
            false,
            false
        );
        GameIdToGame[currentGameId] = _game;
        CompetitionIdToGames[competitionId].push(_game);
        currentGameId++;
        emit NewGame(_game);
    }

    function settleGame(uint256 gameId, uint256 winner)
        external
        gameExists(gameId)
        isOwner()
    {
        Game memory _game = GameIdToGame[gameId];
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
        _game.ended = true;
        GameIdToGame[gameId] = _game;
        emit GameEnded(true);
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
