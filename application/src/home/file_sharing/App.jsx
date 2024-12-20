import Upload from "./artifacts/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.scss";

function FileSharingApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider in v6
          await provider.send("eth_requestAccounts", []);
          const accounts = await window.ethereum.request({ method: "eth_accounts" });

          if (accounts.length === 0) {
            setErrorMessage("No accounts found. Please connect your MetaMask account.");
            return;
          }

          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          setAccount(account);

          // Load contract address from .env
          const contractAddress = process.env.REACT_APP_FILESHARING_CONTRACT_ADDRESS;
          if (!contractAddress) {
            throw new Error("Contract address is not defined. Please set REACT_APP_CONTRACT_ADDRESS in your .env file.");
          }
          console.log("Contract Address:", contractAddress);

          // Initialize the contract
          const contract = new ethers.Contract(contractAddress, Upload.abi, signer);

          const network = await provider.getNetwork();
          if (Number(network.chainId) !== 1337) {
            setErrorMessage(`Unexpected network. Detected chain ID ${network.chainId}. Please connect to the expected network (e.g., Ganache).`);
            return;
          }

          setProvider(provider);
          setContract(contract);
        } catch (error) {
          console.error("Error loading provider or contract:", error);
          setErrorMessage("Failed to load provider. Please ensure MetaMask is connected and properly configured.");
        }
      } else {
        console.error("MetaMask is not installed.");
        setErrorMessage("MetaMask is not installed. Install it from https://metamask.io/ to use this application.");
      }
    };

    loadProvider();
  }, []);

  return (
    <div className="App">
      <h1 style={{ color: "white" }}>File Sharing</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p style={{ color: "white" }}>Account: {account || "Not connected"}</p>
      {provider && contract ? (
        <>
          <FileUpload account={account} provider={provider} contract={contract} />
          <Display contract={contract} account={account} />
          {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
          <button className="share" onClick={() => setModalOpen(true)}>Share</button>
        </>
      ) : (
        <p style={{ color: "white" }}>Loading provider and contract...</p>
      )}
    </div>
  );
}

export default FileSharingApp;
