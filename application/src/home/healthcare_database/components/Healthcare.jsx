import React, { useState, useEffect } from "react";
import { ethers, parseUnits } from "ethers";
import HealthcareRecords from "../artifacts/HealthcareRecords.json";

const Healthcare = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [patientID, setPatientID] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");
    const [patientRecords, setPatientRecords] = useState([]);
    const [providerAddress, setProviderAddress] = useState("");

    const contractAddress = process.env.REACT_APP_HEALTHCARE_CONTRACT_ADDRESS;

    useEffect(() => {
        const connectWallet = async () => {
            try {
                if (!window.ethereum) {
                    alert("MetaMask is required to use this application.");
                    return;
                }
    
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                await web3Provider.send("eth_requestAccounts", []); // Request accounts from MetaMask
    
                const signer = await web3Provider.getSigner(); // Get signer directly
                setProvider(web3Provider);
                setSigner(signer);
    
                // Log the network details
                const network = await web3Provider.getNetwork();
                console.log("Network Chain ID:", network.chainId);
    
                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);
    
                const contract = new ethers.Contract(
                    contractAddress,
                    HealthcareRecords.abi,
                    signer
                );
                setContract(contract);
    
                console.log("Connected to contract:", contract);
    
                const ownerAddress = await contract.getOwner();
                console.log("Contract Owner:", ownerAddress);
                setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        };
    
        connectWallet();
    }, []);
    

    const fetchPatientRecords = async () => {
        try {
            if (!patientID) {
                alert("Please enter a valid patient ID.");
                return;
            }
    
            console.log("Fetching records for Patient ID:", patientID);
            console.log("Caller Account:", account);
    
            // Check if the current user is authorized
            const isAuthorized = await contract.isAuthorizedProvider(account);
            console.log("Is Authorized:", isAuthorized);
            if (!isAuthorized) {
                alert("You are not authorized to fetch patient records.");
                return;
            }
    
            // Fetch patient records
            const records = await contract.getPatientRecords(patientID); // Declare records here
            console.log("Fetched Records:", records);
    
            // Parse the returned records (if needed)
            const parsedRecords = records.map((record) => ({
                recordID: Number(record.recordID),
                patientName: record.patientName,
                diagnosis: record.diagnosis,
                treatment: record.treatment,
                timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString(),
            }));
            setPatientRecords(parsedRecords);
        } catch (error) {
            console.error("Error fetching patient records:", error);
    
            if (error.code === "CALL_EXCEPTION") {
                alert("An error occurred while fetching records. Check if the patient ID exists or if you are authorized.");
            } else {
                alert("Failed to fetch patient records. Check console for details.");
            }
        }
    };
    

    
    const addRecord = async () => {
        try {
            if (!patientID || !diagnosis || !treatment || isNaN(patientID)) {
                alert("Please fill out all fields with valid inputs.");
                return;
            }

            console.log("Adding record with data:", { patientID, diagnosis, treatment });
            const tx = await contract.addRecord(patientID, "Steve", diagnosis, treatment, {
                gasLimit: parseUnits("500000", "wei"),
            });
            console.log("Transaction sent. Hash:", tx.hash);

            const receipt = await tx.wait();
            console.log("Transaction confirmed. Receipt:", receipt);

            fetchPatientRecords();
            alert("Record added successfully.");
        } catch (error) {
            console.error("Error adding record:", error);
            alert("Failed to add record. Check console for details.");
        }
    };

    const authorizeProvider = async () => {
        try {
            if (!isOwner) {
                alert("Only the contract owner can authorize providers.");
                return;
            }

            console.log("Authorizing provider:", providerAddress);
            const tx = await contract.authorizeProvider(providerAddress);
            await tx.wait();
            alert(`Provider ${providerAddress} authorized successfully.`);
        } catch (error) {
            console.error("Error authorizing provider:", error);
        }
    };

    

    return (
        <div className="container">
            <h1 className="title">Healthcare Application</h1>
            {account && <p className="account-info">Connected Account: {account}</p>}
            {isOwner && <p className="owner-info">You are the contract owner.</p>}

            <div className="form-section">
                <h2>Fetch Patient Records</h2>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Enter Patient ID"
                    value={patientID}
                    onChange={(e) => setPatientID(e.target.value)}
                />
                <button className="action-button" onClick={fetchPatientRecords}>Fetch Records</button>
            </div>

            <div className="form-section">
                <h2>Add Patient Record</h2>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                />
                <input
                    className="input-field"
                    type="text"
                    placeholder="Treatment"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                />
                <button className="action-button" onClick={addRecord}>Add Record</button>
            </div>

            <div className="form-section">
                <h2>Authorize Provider</h2>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Provider Address"
                    value={providerAddress}
                    onChange={(e) => setProviderAddress(e.target.value)}
                />
                <button className="action-button" onClick={authorizeProvider}>Authorize Provider</button>
            </div>

            <div className="records-section">
                <h2>Patient Records</h2>
                {patientRecords.map((record, index) => (
                    <div key={index}>
                        <p>Record ID: {record.recordID.toNumber()}</p>
                        <p>Diagnosis: {record.diagnosis}</p>
                        <p>Treatment: {record.treatment}</p>
                        <p>Timestamp: {new Date(Number(record.timestamp) * 1000).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Healthcare;
