import { createContext, ReactNode, useContext, useState } from "react";
import { WalletResponse, WalletErrorType } from "@/types/wallet-response";
import { BrowserProvider, JsonRpcSigner } from "ethers";

const WalletResponseContext = createContext<
  | {
      walletResponse: WalletResponse | undefined;
      setWalletResponse: React.Dispatch<
        React.SetStateAction<WalletResponse | undefined>
      >;
      walletProvider: BrowserProvider | undefined;
      setWalletProvider: React.Dispatch<
        React.SetStateAction<BrowserProvider | undefined>
      >;
      walletSigner: JsonRpcSigner | undefined;
      setWalletSigner: React.Dispatch<
        React.SetStateAction<JsonRpcSigner | undefined>
      >;
      walletAddress: string | undefined;
      setWalletAddress: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
      walletErrorType: WalletErrorType | undefined;
      setWalletErrorType: React.Dispatch<
        React.SetStateAction<WalletErrorType | undefined>
      >;
    }
  | undefined
>(undefined);
export const WalletResponseProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [walletResponse, setWalletResponse] = useState<
    WalletResponse | undefined
  >();
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [walletProvider, setWalletProvider] = useState<
    BrowserProvider | undefined
  >();
  const [walletErrorType, setWalletErrorType] = useState<
    WalletErrorType | undefined
  >();
  const [walletSigner, setWalletSigner] = useState<JsonRpcSigner | undefined>();
  return (
    <WalletResponseContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        walletErrorType,
        setWalletErrorType,
        walletProvider,
        setWalletProvider,
        walletResponse,
        setWalletResponse,
        walletSigner,
        setWalletSigner,
      }}
    >
      {children}
    </WalletResponseContext.Provider>
  );
};
export const useWalletResponse = () => {
  const context = useContext(WalletResponseContext);
  if (!context) {
    throw new Error("useWalletResponse must be within WalletResponseProvider");
  }
  return context;
};
