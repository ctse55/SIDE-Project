import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask detected!");

      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        accountChangedHandler(accounts[0]);
        setConnButtonText("Wallet Connected");
        getAccountBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setErrorMessage(error.message);
      }
    } else {
      console.error("MetaMask not detected!");
      setErrorMessage("Please install MetaMask to use this feature.");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount);
  };

  const getAccountBalance = async (account) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(account);
        setUserBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("MetaMask not detected.");
    }
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountChangedHandler);
      window.ethereum.on("chainChanged", chainChangedHandler);
    } else {
      setErrorMessage("MetaMask not detected.");
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", accountChangedHandler);
        window.ethereum.removeListener("chainChanged", chainChangedHandler);
      }
    };
  }, []);

  return (
    <div className="walletCard">
      <h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount || "Not connected"}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance || "N/A"}</h3>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletCard;
