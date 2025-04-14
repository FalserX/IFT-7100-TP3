"use client";
import { Eip1193Provider, BrowserProvider, JsonRpcSigner } from "ethers";
import { WalletResponse } from "../types/wallet-response";

let provider: BrowserProvider | undefined;
let signer: JsonRpcSigner | undefined;
let address: string | undefined;

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

enum ErrorType {
  NO_PROVIDERS = 0,
  CONNECT_ERROR = 1,
  INSUFFICIENT_FUNDS = 2,
  WALLET_ADDRESS_ERROR = 3,
  WALLET_SIGNER_ERROR = 4,
  WALLET_NO_WINDOW_ERROR = 5,
  OTHER = 6,
}

const ErrorCodes = (errorType: ErrorType): string => {
  switch (errorType) {
    case ErrorType.CONNECT_ERROR: {
      return "errors.connect-error";
    }
    case ErrorType.INSUFFICIENT_FUNDS: {
      return "errors.insufficient_funds";
    }
    case ErrorType.NO_PROVIDERS: {
      return "errors.no-providers";
    }
    case ErrorType.WALLET_ADDRESS_ERROR: {
      return "errors.wallet-address-error";
    }
    case ErrorType.WALLET_NO_WINDOW_ERROR: {
      return "errors.wallet-no-window-error";
    }
    case ErrorType.WALLET_SIGNER_ERROR: {
      return "errors.wallet-signer-error";
    }
    default:
      return "errors.ask-admin-error";
  }
};

export const initWallet = async (): Promise<WalletResponse | undefined> => {
  if (window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    address = signer?.address;
    return { address, provider, signer };
  }
  return;
};

export const disconnect = async (): Promise<string | undefined> => {
  if (!window.ethereum) {
    console.error(ErrorCodes(ErrorType.WALLET_NO_WINDOW_ERROR));
    return ErrorCodes(ErrorType.WALLET_NO_WINDOW_ERROR);
  }
  provider = undefined;
  address = undefined;
  signer = undefined;
  return undefined;
};

export const getProvider = (): BrowserProvider | string | undefined => {
  if (!provider) {
    console.error(ErrorCodes(ErrorType.NO_PROVIDERS));
    return ErrorCodes(ErrorType.NO_PROVIDERS);
  }
  return provider;
};

export const getAddress = (): string | undefined => {
  if (!address) {
    console.error(ErrorCodes(ErrorType.WALLET_ADDRESS_ERROR));
    return ErrorCodes(ErrorType.WALLET_ADDRESS_ERROR);
  }
  return address;
};

export const getSigner = (): JsonRpcSigner | string | undefined => {
  if (!signer) {
    console.error(ErrorCodes(ErrorType.WALLET_SIGNER_ERROR));
    return ErrorCodes(ErrorType.WALLET_SIGNER_ERROR);
  }
  return signer;
};

export const connect = async (): Promise<
  WalletResponse | string | undefined
> => {
  if (!window.ethereum) {
    console.error(ErrorCodes(ErrorType.CONNECT_ERROR));
    return ErrorCodes(ErrorType.CONNECT_ERROR);
  }
  provider = new BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  address = await signer.getAddress();

  return { address, signer, provider };
};

export const isConnected = (): boolean => {
  return !!(address && signer && provider);
};

export const getWallet = async (): Promise<WalletResponse | string> => {
  if (!isConnected) {
    return ErrorCodes(ErrorType.OTHER);
  }
  return { address, signer, provider } as WalletResponse;
};
