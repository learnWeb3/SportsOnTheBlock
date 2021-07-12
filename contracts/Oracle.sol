// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Owner.sol";
import "./BettingContract.sol";

contract Oracle is Owner {
    event NewRequest(Request);

    struct Request {
        string rootUrl;
        string endpoint;
        uint256 id;
        string paramsToFetch;
        uint256 team1Score;
        uint256 team2Score;
        bool exists;
    }

    mapping(uint256 => Request) requests;

    address public bettingContractAddress;

    constructor() {
        owner = msg.sender;
    }

    function deployBettingContract() external isOwner() {
        BettingContract bettingContract = new BettingContract();
        bettingContractAddress = address(bettingContract);
    }

    function createRequest(uint256 gameId) external isOwner() {
        Request memory newRequest = Request({
            rootUrl: "https://soccer.sportmonks.com/api/v2.0",
            endpoint: "/fixtures/",
            id: gameId,
            paramsToFetch: "scores.localteam_score,scores.visitorteam_score",
            team1Score: 0,
            team2Score: 0,
            exists: true
        });

        requests[gameId] = newRequest;
        emit NewRequest(newRequest);
    }

    function updateRequest(
        uint256 gameId,
        uint256 team1Score,
        uint256 team2Score
    ) external isOwner() {
        if (requests[gameId].exists) {
            Request memory request = requests[gameId];
            request.team1Score = team1Score;
            request.team2Score = team2Score;
            requests[gameId] = request;
            BettingContract bettingContract = BettingContract(
                bettingContractAddress
            );
            bettingContract.settleGame(
                requests[gameId].id,
                requests[gameId].team1Score,
                requests[gameId].team2Score
            );
        }
    }

    function newGame(
        uint256 gameId,
        uint256 competitionId,
        uint256 start
    ) external isOwner() {
        BettingContract bettingContract = BettingContract(
            bettingContractAddress
        );
        bettingContract.newGame(gameId, competitionId, start);
    }

    function newCompetition(uint256 competitionId) external {
        BettingContract bettingContract = BettingContract(
            bettingContractAddress
        );
        bettingContract.newCompetition(competitionId);
    }
}
