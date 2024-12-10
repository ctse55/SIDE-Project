import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
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
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          await ethersProvider.send("eth_requestAccounts", []);
          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "Your Contract Address Here"; // Replace with your contract address
          const contractInstance = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );

          setProvider(ethersProvider);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error loading provider or contract:", error);
          setErrorMessage("Failed to load provider. Please ensure MetaMask is connected.");
        }
      } else {
        console.error("MetaMask is not installed.");
        setErrorMessage("MetaMask is not installed. Please install it to use this feature.");
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
