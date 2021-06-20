pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./IsCommon.sol";
import "./GameContract.sol";

contract BetContract is IsCommon {
    // BETSTATES
    enum BETSTATES {OPEN, CLOSED, TOPAY, PAYED}
    
    // Bet data model
    struct Bet {
        GAMEOUTCOMES gameOutcome;
        uint256 amount;
        address payable userAddress;
    }

    mapping(string => Bet[]) MapOutcomeToBet;
    uint256 mapBToBetCount = 0;
    uint256 mapAToBetCount = 0;
    uint256 mapNULLToBetCount = 0;

    mapping(string => uint256) MapOutcomeToBetValue;

    // storage ref to linked GameContract
    address gameAddress;
    // storage bet current state
    BETSTATES betState;
    // storage bets
    Bet[] bets;

    // Events
    event NewBet(Bet);
    event BetStateChanged(BETSTATES);

    // constructor intantiating BetContract from GameContract aka 1 GameCOntract -> 1 BetContract
    constructor(address _gameAddress, address _admin) public {
        admin = _admin;
        gameAddress = _gameAddress;
        betState = BETSTATES.OPEN;
    }

    // PUBLIC

    // settle Bets
    function settleBet(GAMEOUTCOMES gameOutcome, address _admin) public {
        require(
            _admin == admin,
            "You need admin rights to perform this action"
        );
        require(betState == BETSTATES.TOPAY, "bet state must be TOPAY");
        (
            Bet[] memory winnerBets,
            uint256 winnerBetsCount,
            uint256 sumWinnerBets,
            uint256 sumLoserBets
        ) = getBetSettlementData(gameOutcome);

        for (uint256 i; i < winnerBetsCount; i++) {
            // store current bet in temp variable in memory
            Bet memory bet = winnerBets[i];
            uint256 amountPayable =
                calculateAmountPayable(bet.amount, sumLoserBets, sumWinnerBets);
            bet.userAddress.transfer(amountPayable);
        }

        betState = BETSTATES.PAYED;
        emit BetStateChanged(betState);
    }

    // admin setters
    function setBetStateTo_CLOSE(address _admin) public returns (BETSTATES) {
        require(
            _admin == admin,
            "You need admin rights to perform this action"
        );
        betState = BETSTATES.CLOSED;
        return betState;
    }

    function setBetStateTo_TOPAY(address _admin) public returns (BETSTATES) {
        require(
            _admin == admin,
            "You need admin rights to perform this action"
        );
        betState = BETSTATES.TOPAY;
        return betState;
    }

    function setBetStateTo_PAYED(address _admin) public returns (BETSTATES) {
        require(
            _admin == admin,
            "You need admin rights to perform this action"
        );
        betState = BETSTATES.PAYED;
        return betState;
    }

    // EXTERNAL

    // function to take a bet on team A
    function betTeamA() external payable isBetStateOpen() {
        Bet memory newBet =
            Bet({
                gameOutcome: GAMEOUTCOMES.TEAMA,
                amount: msg.value,
                userAddress: msg.sender
            });
        MapOutcomeToBet["A"].push(newBet);
        mapAToBetCount++;
        MapOutcomeToBetValue["A"] += msg.value;
        bets.push(newBet);
        emit NewBet(newBet);
    }

    // function to take a bet on team B
    function betTeamB() external payable isBetStateOpen() {
        Bet memory newBet =
            Bet({
                gameOutcome: GAMEOUTCOMES.TEAMB,
                amount: msg.value,
                userAddress: msg.sender
            });
        MapOutcomeToBet["B"].push(newBet);
        mapBToBetCount++;
        MapOutcomeToBetValue["B"] += msg.value;
        bets.push(newBet);
        emit NewBet(newBet);
    }

    // function to take a bet on NULL
    function betNULL() external payable isBetStateOpen() {
        Bet memory newBet =
            Bet({
                gameOutcome: GAMEOUTCOMES.NULL,
                amount: msg.value,
                userAddress: msg.sender
            });
        MapOutcomeToBet["NULL"].push(newBet);
        mapNULLToBetCount++;
        MapOutcomeToBetValue["NULL"] += msg.value;
        bets.push(newBet);
        emit NewBet(newBet);
    }

    function getBetStatsA()
        external
        view
        returns (
            Bet[] memory teamABets,
            uint256 teamABetsSum,
            uint256 teamABetsCount,
            bool isTeamAWinner
        )
    {
        isTeamAWinner = game.gameOutcome == GAMEOUTCOMES.NULL ? true : false;
        return (
            MapOutcomeToBet["A"],
            MapOutcomeToBetValue["A"],
            mapAToBetCount,
            isTeamAWinner
        );
    }

    function getBetStatsB()
        external
        view
        returns (
            Bet[] memory teamBBets,
            uint256 teamBBetsSum,
            uint256 teamBBetsCount,
            bool isTeamBWinner
        )
    {
        isTeamBWinner = game.gameOutcome == GAMEOUTCOMES.NULL ? true : false;
        return (
            MapOutcomeToBet["B"],
            MapOutcomeToBetValue["B"],
            mapBToBetCount,
            isTeamBWinner
        );
    }

    function getBetStatsNull()
        external
        view
        returns (
            Bet[] memory nullBets,
            uint256 nullBetsSum,
            uint256 nullBetsCount,
            bool isNullWinner
        )
    {
        bool _isNullWinner =
            game.gameOutcome == GAMEOUTCOMES.NULL ? true : false;
        return (
            MapOutcomeToBet["NULL"],
            MapOutcomeToBetValue["NULL"],
            mapNULLToBetCount,
            _isNullWinner
        );
    }

    // PRIVATE

    // calculate amount due to winner by weighting the initial amount bet on the sum of the losers bet value;
    function calculateAmountPayable(
        uint256 initalBetAmount,
        uint256 sumLoserBets,
        uint256 sumWinnerBets
    ) private pure returns (uint256) {
        return
            initalBetAmount +
            (((initalBetAmount * sumWinnerBets) / 100) / 100) *
            sumLoserBets;
    }

    // getting winnerBets according to Game issue and returning winnerBets, winnerBetsCount, sumWinnerBets, sumLoserBets to calculateAmountPayable
    function getBetSettlementData(GAMEOUTCOMES gameOutcome)
        private
        view
        returns (
            Bet[] memory winnerBets,
            uint256 winnerBetsCount,
            uint256 sumWinnerBets,
            uint256 sumLoserBets
        )
    {
        if (gameOutcome == GAMEOUTCOMES.TEAMA) {
            winnerBets = MapOutcomeToBet["A"];
            winnerBetsCount = mapAToBetCount;
            sumWinnerBets = MapOutcomeToBetValue["A"];
            sumLoserBets =
                MapOutcomeToBetValue["B"] +
                MapOutcomeToBetValue["NULL"];
        } else if (gameOutcome == GAMEOUTCOMES.TEAMB) {
            winnerBets = MapOutcomeToBet["B"];
            winnerBetsCount = mapBToBetCount;
            sumWinnerBets = MapOutcomeToBetValue["B"];
            sumLoserBets =
                MapOutcomeToBetValue["A"] +
                MapOutcomeToBetValue["NULL"];
        } else {
            winnerBets = MapOutcomeToBet["NULL"];
            winnerBetsCount = mapNULLToBetCount;
            sumWinnerBets = MapOutcomeToBetValue["NULL"];
            sumLoserBets =
                MapOutcomeToBetValue["A"] +
                MapOutcomeToBetValue["B"];
        }
        return (winnerBets, winnerBetsCount, sumWinnerBets, sumLoserBets);
    }

    // modifiers
    modifier isBetStateOpen() {
        require(
            betState == BETSTATES.OPEN,
            "Game has already started, you can not take bets any longer"
        );
        _;
    }
}
