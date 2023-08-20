const Engager = artifacts.require("Engager");

module.exports = function(deployer) {
  deployer.deploy(Engager);
};
