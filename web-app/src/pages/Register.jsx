// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ethers } from "ethers";

// const contractABI = [
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "instituteAddress", "type": "address" },
//       { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
//       { "indexed": false, "internalType": "uint256", "name": "registrationTime", "type": "uint256" }
//     ],
//     "name": "InstituteRegistered",
//     "type": "event"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "_institute", "type": "address" }],
//     "name": "isRegistered",
//     "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
//     "name": "registerInstitute",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "name": "institutes",
//     "outputs": [
//       { "internalType": "string", "name": "name", "type": "string" },
//       { "internalType": "uint256", "name": "registrationTime", "type": "uint256" },
//       { "internalType": "bool", "name": "exists", "type": "bool" }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// const Register = () => {
//   const [loading, setLoading] = useState(false);
//   const [account, setAccount] = useState(null);
//   const [institutionName, setInstitutionName] = useState("");
//   const navigate = useNavigate();
//   const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (window.ethereum) {
//         try {
//           const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//           if (accounts.length > 0) {
//             setAccount(accounts[0]);
//             checkIfRegistered(accounts[0]);
//           }
//         } catch (error) {
//           console.error("Error connecting MetaMask:", error);
//         }
//       }
//     };
//     connectWallet();
//   }, []);

//   const checkIfRegistered = async (walletAddress) => {
//     try {
//       if (!contractAddress) throw new Error("Contract address missing in environment variables.");
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const contract = new ethers.Contract(contractAddress, contractABI, provider);

//       const isRegistered = await contract.isRegistered(walletAddress);
//       if (isRegistered) {
//         alert("Institute already registered. Redirecting...");
//         navigate("/issue");
//       }
//     } catch (error) {
//       console.error("Error checking registration:", error);
//     }
//   };

//   const registerInstitute = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     if (!institutionName.trim()) {
//       alert("Please provide the institution name.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, contractABI, signer);

//       // Check if already registered
//       const isRegistered = await contract.isRegistered(await signer.getAddress());
//       if (isRegistered) {
//         alert("Institute is already registered. Redirecting...");
//         navigate("/issue");
//         return;
//       }

//       // Register institute
//       const tx = await contract.registerInstitute(institutionName);
//       await tx.wait();

//       alert("Registration successful! Redirecting...");
//       navigate("/issue");
//       window.location.reload(); // Refresh app state
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert(`Registration failed: ${error.message || error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Register Institute</h1>
//       <input
//         type="text"
//         placeholder="Enter Institution Name"
//         value={institutionName}
//         onChange={(e) => setInstitutionName(e.target.value)}
//         disabled={loading}
//       />
//       <button onClick={registerInstitute} disabled={loading || !account}>
//         {loading ? "Registering..." : account ? "Register" : "Connect Wallet First"}
//       </button>
//     </div>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "instituteAddress", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "registrationTime", "type": "uint256" }
    ],
    "name": "InstituteRegistered",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_institute", "type": "address" }],
    "name": "isRegistered",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
    "name": "registerInstitute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "institutes",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "registrationTime", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [institutionName, setInstitutionName] = useState("");
  const navigate = useNavigate();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkIfRegistered(accounts[0]);
          }
        } catch (error) {
          console.error("Error connecting MetaMask:", error);
        }
      }
    };
    connectWallet();
  }, []);

  const checkIfRegistered = async (walletAddress) => {
    try {
      if (!contractAddress) throw new Error("Contract address missing in environment variables.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const isRegistered = await contract.isRegistered(walletAddress);
      if (isRegistered) {
        navigate("/issue"); // Redirect without alert
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const registerInstitute = async () => {
    if (!window.ethereum) return;

    if (!institutionName.trim()) return;

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Check if already registered
      const isRegistered = await contract.isRegistered(await signer.getAddress());
      if (isRegistered) {
        navigate("/issue"); // Redirect without alert
        return;
      }

      // Register institute
      const tx = await contract.registerInstitute(institutionName);
      await tx.wait();

      navigate("/issue"); // Redirect without alert
      window.location.reload();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register Institute</h1>
      <input
        type="text"
        placeholder="Enter Institution Name"
        value={institutionName}
        onChange={(e) => setInstitutionName(e.target.value)}
        disabled={loading}
      />
      <button onClick={registerInstitute} disabled={loading || !account}>
        {loading ? "Registering..." : account ? "Register" : "Connect Wallet First"}
      </button>
    </div>
  );
};

export default Register;
