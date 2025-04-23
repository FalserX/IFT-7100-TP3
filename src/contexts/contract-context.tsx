"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "@/Marketplace.json";
import { useWallet } from "./wallet-context";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const LOCAL_MARKETPLACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_LOCAL_MARKETPLACE_CONTRACT_ADDRESS || "";
type ContractContextType = {
  contract: ethers.Contract | null;
  loading: boolean;
};

const ContractContext = createContext<ContractContextType>({
  contract: null,
  loading: true,
});

export const useContractContext = () => useContext(ContractContext);

export const ContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const { provider, signer } = useWallet();
  useEffect(() => {
    if (provider && signer && LOCAL_MARKETPLACE_CONTRACT_ADDRESS !== "") {
      const marketplaceContract = new ethers.Contract(
        LOCAL_MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceAbi.abi,
        signer
      );
      setContract(marketplaceContract);
      setLoading(false);
    }
  }, [provider, signer]);
  const value = {
    contract,
    loading,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
