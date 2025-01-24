require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
    solidity: '0.8.0',
    networks: {
        amoy: {
            url: process.env.POLYGON_RPC_URL, // Use Amoy RPC URL from .env
            accounts: [process.env.PRIVATE_KEY], // Your wallet private key
        },
    },
};
