var  Upload = artifacts.require("Upload");
var HealthcareRecords = artifacts.require("HealthcareRecords");

module.exports = function(deployer) {

  deployer.deploy(Upload);
  deployer.deploy(HealthcareRecords);
  
};