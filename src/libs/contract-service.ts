import { ethers } from "ethers";
import MarketplaceAbi from "../Marketplace.json";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

export const getContract = async () => {
  try {
    if (!window.ethereum) throw new Error("Metamask not detected");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, MarketplaceAbi.abi, signer);
  } catch (err) {
    throw new Error(`An error occured when gathering the app contract. ${err}`);
  }
};
