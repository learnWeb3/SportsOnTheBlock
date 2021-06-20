pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./CompetitionContract.sol";

contract CompetitionFactoryContract {
    CompetitionContract[] competionsAddresses;
    address admin;

    event NewCompetitionContract(CompetitionContract);

    constructor() public {
        admin = msg.sender;
    }

    function createCompetition(string calldata _name) external isAdmin() {
        CompetitionContract newCompetitionContract =
            new CompetitionContract(_name, admin);
        competionsAddresses.push(newCompetitionContract);
        emit NewCompetitionContract(newCompetitionContract);
    }

    function getCompetitionsAdresses()
        external
        view
        isAdmin()
        returns (CompetitionContract[] memory)
    {
        return competionsAddresses;
    }

    modifier isAdmin() {
        require(
            msg.sender == admin,
            "You need admin rights to perform this action"
        );

        _;
    }
}
