require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    polygonzkEVM: {  // Ensure lowercase "polygonzkEVM" to match CLI command
      url: process.env.ALCHEMY_URL, // Ensure consistency in env variable name
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Securely load private key
    },
    localhost: {
      url:"http://127.0.0.1:8545",
    },
    polygonAmoy: {
      url: process.env.ALCHEMY_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],  // Ensure PRIVATE_KEY is stored securely
  }

  },
};
