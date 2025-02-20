import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "./CenteredBox.css";

const contractABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_institute", "type": "address" }],
    "name": "isRegistered",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CenteredBox = () => {
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask accounts:", error);
        }
      }
    };
    checkWallet();
  }, []);

  useEffect(() => {
    if (account) {
      checkRegistration(account);
    }
  }, [account]); // Run whenever `account` updates

  const checkRegistration = async (walletAddress) => {
    if (!contractAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const registered = await contract.isRegistered(walletAddress);
      setIsRegistered(registered);
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleIssueClick = () => {
    if (!account) {
      alert("Please connect your wallet to issue a certificate.");
      return;
    } 
    navigate(isRegistered ? "/issue" : "/register");
  };

  return (
    <div className="container">
      <div className="box">
        <p>A Decentralized Certificate Issuance and Verification System.</p>
        <div className="buttonContainer">
          <button className="actionButton" onClick={handleIssueClick}>
            Issue
          </button>
          <button className="actionButton" onClick={() => navigate("/verify")}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};
