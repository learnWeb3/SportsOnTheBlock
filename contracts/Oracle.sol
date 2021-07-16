// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Owner.sol";
import "./BettingContract.sol";

contract Oracle is Owner {
    event NewRequest(Request);

    struct Request {
        string rootUrl;
        string paramsToFetch;
        string endpoint;
        string gameStatus;
        uint192 id;
        uint32 team1Score;
        uint32 team2Score;
        bool exists;
    }

    mapping(uint256 => Request) public requests;

    address public bettingContractAddress;

    constructor() {
        owner = msg.sender;
    }

    function deployBettingContract() external isOwner() {
        BettingContract bettingContract = new BettingContract();
        bettingContractAddress = address(bettingContract);
    }

    function createRequest(uint192 gameId) external isOwner() {
        Request memory newRequest = Request({
            rootUrl: "https://soccer.sportmonks.com/api/v2.0",
            paramsToFetch: "scores.localteam_score,scores.visitorteam_score,time.status",
            endpoint: "/fixtures/",
            gameStatus: "",
            id: gameId,
            team1Score: 0,
            team2Score: 0,
            exists: true
        });

        requests[gameId] = newRequest;
        emit NewRequest(newRequest);
    }

    function updateRequest(
        uint192 gameId,
        uint32 team1Score,
        uint32 team2Score,
        string calldata gameStatus
    ) external isOwner() {
        if (requests[gameId].exists) {
            Request memory request = requests[gameId];
            request.team1Score = team1Score;
            request.team2Score = team2Score;
            request.gameStatus = gameStatus;
            requests[gameId] = request;
            BettingContract bettingContract = BettingContract(
                bettingContractAddress
            );
            bettingContract.settleGame(
                uint32(requests[gameId].id),
                requests[gameId].team1Score,
                requests[gameId].team2Score
            );
        }
    }

    function newGame(
        uint96 gameId,
        uint256 competitionId,
        uint56 start
    ) external isOwner() {
        BettingContract bettingContract = BettingContract(
            bettingContractAddress
        );
        bettingContract.newGame(gameId, competitionId, start);
    }

    function newCompetition(uint256 competitionId) external isOwner() {
        BettingContract bettingContract = BettingContract(
            bettingContractAddress
        );
        bettingContract.newCompetition(competitionId);
    }
}
