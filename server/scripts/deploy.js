// const hre = require("hardhat");

// async function main() {
//   // Get the contract factory
//   const InstituteRegistration = await hre.ethers.getContractFactory("InstituteRegistration");

//   // Deploy the contract
//   const contract = await InstituteRegistration.deploy();  // Remove `await` here
//   await contract.waitForDeployment();  // Correct function to wait for deployment

//   // Get the deployed contract address
//   console.log("InstituteRegistration deployed to:", await contract.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const InstituteRegistration = await hre.ethers.getContractFactory("InstituteRegistration");

  // Deploy the contract
  const contract = await InstituteRegistration.deploy();  
  await contract.waitForDeployment();  // ✅ Correct way to wait for deployment

  // Get the deployed contract address
  console.log("InstituteRegistration deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
