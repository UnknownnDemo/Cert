
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../style/register.css"; 
import { getContractInstance } from "../utils/getABI.js";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [instituteWallet, setInstituteWallet] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [website, setWebsite] = useState("");
  const navigate = useNavigate();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkAdmin(accounts[0]);
          }
        } catch (error) {
          console.error("Error connecting MetaMask:", error);
        }
      }
    };
    connectWallet();
  }, []);

  const checkAdmin = async (walletAddress) => {
    if (!contractAddress) return;

    try {
      const contract = await getContractInstance(contractAddress);
      if (!contract) return;

      const owner = await contract.owner();

      setIsAdmin(walletAddress.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error("Error checking admin:", error);
    }
  };

  const checkIfRegistered = async (walletAddress) => {
    if (!walletAddress) {
      alert("Please enter an institute wallet address.");
      return true;
    }
    try {
      const contract = await getContractInstance(contractAddress);
        if (!contract) return true;

      const isRegistered = await contract.isRegistered(walletAddress);
      return isRegistered;
    } catch (error) {
      console.error("Error checking registration:", error);
      return true;
    }
  };

  const registerInstitute = async () => {
    if (!window.ethereum) return;
    if (!institutionName.trim() || !acronym.trim() || !website.trim() || !instituteWallet.trim()) {
      alert("All fields are required.");
      return;
    }
    if (!ethers.isAddress(instituteWallet)) {
      alert("Invalid Ethereum address.");
      return;
    }
    if (!isAdmin) {
      alert("Only the admin can register new institutes.");
      return;
    }

    try {
      setLoading(true);
      const alreadyRegistered = await checkIfRegistered(instituteWallet);
      if (alreadyRegistered) {
        alert("This institute is already registered.");
        return;
      }

      const contract = await getContractInstance(contractAddress);
      if (!contract) return true;

      const tx = await contract.registerInstitute(instituteWallet, institutionName, acronym, website);
      await tx.wait();

      alert("Institute registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">Register Institute</h1>
        <div className="form-group">
          <label htmlFor="instituteWallet">Institute Wallet Address</label>
          <input
            id="instituteWallet"
            type="text"
            placeholder="Enter Institute Wallet Address"
            value={instituteWallet}
            onChange={(e) => setInstituteWallet(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="institutionName">Institution Name</label>
          <input
            id="institutionName"
            type="text"
            placeholder="Enter Institution Name"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="acronym">Acronym</label>
          <input
            id="acronym"
            type="text"
            placeholder="Enter Acronym"
            value={acronym}
            onChange={(e) => setAcronym(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="website">Website URL</label>
          <input
            id="website"
            type="text"
            placeholder="Enter Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <button 
          className="registration-button"
          onClick={registerInstitute} 
          disabled={loading || !account}
        >
          {loading ? "Registering..." : account ? "Register" : "Connect Wallet First"}
        </button>
      </div>
    </div>
  );
};

export default Register;