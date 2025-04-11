import { Eip1193Provider, BrowserProvider, JsonRpcSigner } from "ethers";
import { WalletResponse } from "../types/wallet-response";
import { ErrorCodes } from "../utils/errors";

let provider: BrowserProvider | undefined;
let signer: JsonRpcSigner | undefined;
let address: string | undefined;

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const disconnect = async () => {
  if (!window.ethereum) {
    console.error(ErrorCodes.CONNECT_ERROR);
    return;
  }
  provider = undefined;
  address = undefined;
  signer = undefined;
};

export const getProvider = (): BrowserProvider | undefined => {
  if (!provider) {
    console.error(ErrorCodes.NO_PROVIDERS);
    return;
  }
  return provider;
};

export const getAddress = (): string | undefined => {
  if (!address) {
    console.error(ErrorCodes.WALLET_ADDRESS_ERROR);
    return;
  }
  return address;
};

export const getSigner = (): JsonRpcSigner | undefined => {
  if (!signer) {
    console.error(ErrorCodes.WALLET_SIGNER_ERROR);
    return;
  }
  return signer;
};

export const connect = async (): Promise<WalletResponse | undefined> => {
  if (!window.ethereum) {
    console.error(ErrorCodes.CONNECT_ERROR);
    return;
  }

  provider = new BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  address = await signer.getAddress();

  return { address, signer, provider };
};

export const isConnected = (): boolean => {
  return !!address && !!signer && !!provider;
};
