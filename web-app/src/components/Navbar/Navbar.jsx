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
      </div>
    </nav>
  );
};

export default Navbar;
