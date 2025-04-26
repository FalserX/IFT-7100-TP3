import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL ? process.env.SEPOLIA_RPC_URL : "",
      accounts: process.env.WALLET_KEY ? [process.env.WALLET_KEY] : [],
    },
  },
};
export default config;
