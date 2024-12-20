import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./Modal.scss";

const Modal = ({ setModalOpen, contract }) => {
  const [addressInput, setAddressInput] = useState(""); // State to manage the input field
  const [accessList, setAccessList] = useState([]); // State to manage the list of addresses with access

  const sharing = async () => {
    console.log("Captured Address Input:", addressInput);

    if (!ethers.isAddress(addressInput)) {
      alert("Invalid Ethereum address");
      return;
    }

    try {
      const tx = await contract.allow(addressInput);
      console.log("Transaction sent. Hash:", tx.hash);
      alert("Access granted successfully");

      // Refresh the access list after granting access
      fetchAccessList();

      // Clear the input field and close the modal
      setAddressInput("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error sharing access:", error);
      alert("Failed to grant access");
    }
  };

  const fetchAccessList = async () => {
    if (contract) {
      try {
        const addressList = await contract.shareAccess();
        console.log("Fetched Access List:", addressList);
        setAccessList(addressList);
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    }
  };

  useEffect(() => {
    fetchAccessList(); // Fetch the list of addresses with access on component mount
  }, [contract]);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">Share with</div>
        <div className="body">
          <label htmlFor="addressInput" className="sr-only">
            Ethereum Address
          </label>
          <input
            type="text"
            id="addressInput"
            className="address"
            placeholder="Enter Ethereum Address"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)} // Update state on input change
          />
        </div>
        <form id="myForm">
          <select id="selectNumber">
            <option>People With Access</option>
            {accessList.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}
          </select>
        </form>
        <div className="footer">
          <button onClick={() => setModalOpen(false)} id="cancelBtn">
            Cancel
          </button>
          <button onClick={sharing}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
