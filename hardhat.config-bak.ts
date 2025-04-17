import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const {API_URL, WALLET_KEY} = process.env
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: {
    version:"0.8.28"
  },
  networks: {
    // for mainnet
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [WALLET_KEY as string],
      gasPrice: 1000000000
    },
    // for testnet
    'base-sepolia': {
      url: 'https://sepolia.base.org',
      accounts: [WALLET_KEY as string],
      gasPrice: 1000000000
    },
    // From Sepolia
    'sepolia':{
      url: API_URL,
      accounts: [WALLET_KEY as string],
      gasPrice: 1000000000
    },
    // for local dev environment
    'base-local': {
      url: "http://localhost:8545",
      accounts: [WALLET_KEY as string],
      gasPrice: 1000000000
    },
  },
  defaultNetwork: 'hardhat'
};


export default config;
