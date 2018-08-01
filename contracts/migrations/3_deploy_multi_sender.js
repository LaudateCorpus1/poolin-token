var sol = artifacts.require("./MultiSender.sol");

module.exports = function(deployer) {
  deployer.deploy(sol);
};
