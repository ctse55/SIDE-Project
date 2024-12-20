import { useState } from "react";
import { ethers } from "ethers";
import "./Display.scss";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]); // Store the list of IPFS data
  const [error, setError] = useState(""); // State to display error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const getData = async () => {
    const inputField = document.querySelector(".address");
    const otherAddress = inputField ? inputField.value.trim() : "";

    // Reset error and loading states
    setError("");
    setLoading(true);

    if (otherAddress && !ethers.isAddress(otherAddress)) {
      setError("Invalid Ethereum address.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching data for address:", otherAddress || account);

      const dataArray = otherAddress
        ? await contract.display(otherAddress)
        : await contract.display(account);

      if (dataArray.length === 0) {
        setError("No images available to display.");
        setLoading(false);
        return;
      }

      console.log("Fetched Data:", dataArray);

      setData(dataArray); // Store fetched data
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Access denied or error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="error">{error}</div>} {/* Display error messages */}
      {loading && <div className="loading">Loading...</div>} {/* Display loading indicator */}
      <div className="image-list">
        {data.map((item, index) => (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt={`IPFS Image ${index}`}
              className="image-list-item"
            />
          </a>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Ethereum Address"
          className="address"
          aria-label="Ethereum Address Input"
        />
        <button
          className="center button"
          onClick={getData}
          aria-label="Fetch Images"
        >
          Get Data
        </button>
      </div>
    </>
  );
};

export default Display;
