import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthcareRecords from "./artifacts/HealthcareRecords.json"; // Ensure this path is correct
import Healthcare from "./components/Healthcare";
import "./App.scss"; // Use the correct CSS file for styling

function App() {
  const [contract, setContract] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const contractAddress = process.env.REACT_APP_HEALTHCARE_CONTRACT_ADDRESS; // Loaded from .env file

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask is required to interact with this application.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request wallet connection
        const signer = await provider.getSigner();

        const contractInstance = new ethers.Contract(
          contractAddress,
          HealthcareRecords.abi,
          signer
        );

        setContract(contractInstance);

        const owner = await contractInstance.getOwner(); // Fetch contract owner
        setOwnerAddress(owner);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initializeContract();
  }, [contractAddress]);

  return (
    <div className="App">
      {contract && ownerAddress ? (
        <Healthcare contract={contract} ownerAddress={ownerAddress} />
      ) : (
        <p>Loading contract data, please wait...</p>
      )}
    </div>
  );
}

export default App;
