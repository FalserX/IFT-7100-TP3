"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers, JsonRpcSigner, Network } from "ethers";

type WalletContextType = {
  address: string | null;
  signer: JsonRpcSigner | null;
  provider: ethers.BrowserProvider | null;
  loading: boolean;
  connectMetaMask: () => Promise<void>;
  getBalance: () => Promise<number>;
  getNetwork: () => Promise<Network | string>;
  logout: () => void;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  signer: null,
  provider: null,
  loading: true,
  connectMetaMask: async () => {
    console.log("connectMetaMask function is not initialized");
  },
  getBalance: async () => {
    console.log("getBalance function is not initialized");
    return 0;
  },
  getNetwork: async () => {
    console.log("getNetwork function is not initialized");
    return "";
  },
  logout: async () => {
    console.log("logout function is not intialized");
  },
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = () => {
    setAddress(null);
    setSigner(null);
    localStorage.setItem("wallet-disconnect", "true");
  };

  useEffect(() => {
    const connectWallet = async () => {
      if (
        typeof window.ethereum !== "undefined" &&
        !localStorage.getItem("wallet-disconnect")
      ) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();
        const address = await ethSigner.getAddress();
        setProvider(ethProvider);
        setSigner(ethSigner);
        setAddress(address);
      }
      setLoading(false);
    };
    connectWallet();
  }, []);
  const connectMetaMask = async (): Promise<void> => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();
        const address = await ethSigner.getAddress();
        setProvider(ethProvider);
        setSigner(ethSigner);
        setAddress(address);
        if (localStorage.getItem("wallet-disconnect")) {
          localStorage.removeItem("wallet-disconnect");
        }
      } catch (error) {
        console.log(`Error connecting to MetaMask : ${error}`);
      }
    } else {
      console.log("MetaMask not installed");
    }
  };

  const getBalance = async (): Promise<number> => {
    try {
      const balance = await provider?.getBalance(address ?? "");

      const result = parseFloat(ethers.formatEther(balance ?? 0));
      return !isNaN(result) ? result : 0;
    } catch (err) {
      console.log(`Error connecting to MetaMask: ${err}`);
      return 0;
    }
  };

  const getNetwork = async (): Promise<Network | string> => {
    try {
      const network = await provider?.getNetwork();
      return network ?? "";
    } catch (err) {
      console.log(`Error connecting to MetaMask: ${err}`);
      return "";
    }
  };
  const value = {
    address,
    signer,
    provider,
    loading,
    connectMetaMask,
    getBalance,
    getNetwork,
    logout,
  };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
