require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    polygonZkEVM: {
      url: process.env.ALCHEMY_URL, // Using Alchemy for Polygon zkEVM Cardona
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
