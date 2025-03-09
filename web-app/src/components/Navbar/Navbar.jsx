import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "./Navbar.css";

const contractABI = [
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";
  const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS || ""; // Admin address from env

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkAdmin(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask accounts:", error);
        }
      }
    };

    checkWallet();

    // If wallet was connected before, refresh once to ensure components recognize it
    if (localStorage.getItem("walletConnected") === "true") {
      localStorage.removeItem("walletConnected"); // Prevent infinite reloads
      window.location.reload();
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        checkAdmin(accounts[0]);

        // Store connection status in localStorage
        localStorage.setItem("walletConnected", "true");

        // Refresh the whole window
        window.location.reload();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  const checkAdmin = async (walletAddress) => {
    if (!contractAddress) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const owner = await contract.owner();

      setIsAdmin(walletAddress.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error("Error checking admin:", error);
    }
  };

  const handleRegisterClick = () => {
    if (isAdmin) {
      navigate("/register");
    } else {
      alert("Only the admin can register new institutes.");
    }
  };

  return (
    <nav className="navbar">
      <button onClick={() => navigate("/")}>CertiQ</button>
      <div>
        <button onClick={connectWallet} className="nav-button">
          {account ? "Connected" : "Connect"}
        </button>
        <button onClick={handleRegisterClick}>Register Institute</button>
      </div>
    </nav>
  );
};

export default Navbar;

/*
  // import React from 'react';
// import './Navbar.css';

// export const Navbar = () => {
//   return (
//     <div className="navbar">
//       <button>CertiQ</button>
//       <button>Connect</button>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "./Navbar.css";

const Navbar = () => {
  const [account, setAccount] = useState(null);
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

    // If wallet was connected before, refresh once to ensure components recognize it
    if (localStorage.getItem("walletConnected") === "true") {
      localStorage.removeItem("walletConnected"); // Prevent infinite reloads
      window.location.reload();
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        // Store connection status in localStorage
        localStorage.setItem("walletConnected", "true");

        // Refresh the whole window
        window.location.reload();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  return (
    <nav className="navbar">
      <button onClick={() => navigate("/")}>CertiQ</button>
      <div>
        <button onClick={connectWallet} className="nav-button">
          {account ? `Connected` : "Connect"}
        </button>
        <button onclick={()=>navigate("/register")}>Register Institute</button>
      </div>
    </nav>
  );
};

export default Navbar;

*/