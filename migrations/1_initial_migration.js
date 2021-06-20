const CompetitionFactoryContract = artifacts.require(
  "CompetitionFactoryContract"
);

module.exports = function (deployer) {
  deployer.deploy(CompetitionFactoryContract);
};
