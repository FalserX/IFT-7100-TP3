import { ethers } from "ethers";
import MarketplaceAbi from "../Marketplace.json";

const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; 

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask non détecté");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, MarketplaceAbi.abi, signer);
};
