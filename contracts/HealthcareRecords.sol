// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract HealthcareRecords {
    address owner;

    struct Record {
        uint256 recordID;
        string patientName;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping(uint256 => Record[]) private patientRecords;   //store the patient records 

    mapping(address => bool) private authorizedProviders;

    modifier onlyOwner () {  //only owner can perform this function
        require(msg.sender == owner, "Only owner can perform this function");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not an authorized provider");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner; 
    }

    function authorizeProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;

    }

    function addRecord(uint256 patientID, string memory patientName, string memory diagnosis, string memory treatment) public onlyAuthorizedProvider {
        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(Record(recordID, patientName, diagnosis, treatment, block.timestamp)); 
    }

    function getPatientRecords(uint256 patientID) public view onlyAuthorizedProvider returns (Record[] memory) {
    require(patientRecords[patientID].length > 0, "No records found for this patient ID");
    return patientRecords[patientID];
    }


    function isAuthorizedProvider(address provider) public view returns (bool) {
        return authorizedProviders[provider];
    }

}

