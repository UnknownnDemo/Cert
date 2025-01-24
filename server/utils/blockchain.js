const { ethers } = require('ethers');

require('dotenv').config();

// Connect to the Polygon 

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

// Wallet setup
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractABI = [
    // Contract ABI array here
];
const contractAddress = "DEPLOYED_CONTRACT_ADDRESS"; // Replace with your deployed contract address

// Initialize contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to issue a certificate
const issueCertificate = async (recipient, ipfsHash) => {
    try {
        const tx = await contract.issueCertificate(recipient, ipfsHash);
        return tx; // Return transaction object for reference
    } catch (error) {
        console.error("Error issuing certificate:", error);
        throw error;
    }
};

// Export functions and contract instance
module.exports = {
    provider,
    wallet,
    contract,
    issueCertificate,
};
