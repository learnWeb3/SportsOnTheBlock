pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./GameContract.sol";

contract CompetitionContract {
    mapping(address => GameContract) GameContractAdressesToGameContract;

    struct Competition {
        string name;
        GameContract[] gamesAddresses;
        address admin;
    }

    Competition competition;

    event NewGameContract(GameContract);

    constructor(string memory _name, address _admin) public {
        competition = Competition({
            admin: _admin,
            name: _name,
            gamesAddresses: new GameContract[](0)
        });
    }

    function getGamesAdresses()
        external
        view
        isAdmin()
        returns (GameContract[] memory)
    {
        return competition.gamesAddresses;
    }

    function getName() external view isAdmin() returns (string memory) {
        return competition.name;
    }

    function getAdmin() public view returns (address) {
        return competition.admin;
    }

    function getCompetition() external view returns (Competition memory) {
        return competition;
    }

    function createGame(
        string calldata teamAName,
        string calldata teamBName,
        string calldata description,
        uint256 _start
    ) external isAdmin() {
        address currentAdmin = getAdmin();
        GameContract newGameContract =
            new GameContract(
                teamAName,
                teamBName,
                description,
                _start,
                currentAdmin
            );
        competition.gamesAddresses.push(newGameContract);
        emit NewGameContract(newGameContract);
    }

    modifier isAdmin() {
        require(
            msg.sender == competition.admin,
            "You need admin rights to perform this action"
        );
        _;
    }
}
