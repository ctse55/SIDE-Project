var  Upload = artifacts.require("Upload");
var optHealthCare = artifacts.require("./optimized_healthCare.sol");
var docAddRecord = artifacts.require("./DoctorAddRecord.sol")
module.exports = function(deployer) {

  deployer.deploy(Upload);
  deployer.deploy(optHealthCare);
  deployer.deploy(docAddRecord);
  
};