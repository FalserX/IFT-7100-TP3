import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with address:", deployer.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.waitForDeployment();

  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment: ", error);
    process.exit(1);
  });
