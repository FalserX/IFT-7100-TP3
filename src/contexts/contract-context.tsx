"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "@/Marketplace.json";
import { useWallet } from "./wallet-context";
import { ProductType } from "@/types/product";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const LOCAL_MARKETPLACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_LOCAL_MARKETPLACE_CONTRACT_ADDRESS || "";
type ContractContextType = {
  contract: ethers.Contract | null;
  loading: boolean;
  getAllProducts: () => Promise<ProductType[]>;
  getAverageRating: (sellerId: string) => Promise<number>;
};

const ContractContext = createContext<ContractContextType>({
  contract: null,
  loading: true,
  getAllProducts: async () => {
    const products: ProductType[] = [];
    return Promise.resolve(products);
  },
  getAverageRating: async (sellerId: string) => {
    console.log(sellerId);
    return Promise.resolve(2.5);
  },
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
    if (
      provider &&
      signer &&
      (CONTRACT_ADDRESS !== ""
        ? CONTRACT_ADDRESS
        : LOCAL_MARKETPLACE_CONTRACT_ADDRESS !== "")
    ) {
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS !== ""
          ? CONTRACT_ADDRESS
          : LOCAL_MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceAbi.abi,
        signer
      );
      setContract(marketplaceContract);
      setLoading(false);
    }
  }, [provider, signer]);

  const getAverageRating = async (sellerId: string): Promise<number> => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      const averageRating = await contract.getAverageRating(sellerId);
      return typeof averageRating === "bigint"
        ? Number(averageRating)
        : typeof averageRating === "string" && averageRating.startsWith("0x")
        ? parseInt(averageRating, 16)
        : Number(averageRating);
    } catch (err) {
      console.log("API Error: ", err);
      return 2.5;
    }
  };

  const getAllProducts = async (): Promise<ProductType[]> => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      const products = await contract.getAllProducts();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productsResults: ProductType[] = products.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        price: Number(ethers.formatUnits(p.price.toString())),
        seller: p.seller,
        stock: p.stock.toString(),
      }));
      return productsResults;
    } catch (err) {
      console.log("API Error: ", err);
      return [];
    }
  };
  const value = {
    contract,
    loading,
    getAllProducts,
    getAverageRating,
  };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
