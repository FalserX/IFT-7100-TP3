import { Eip1193Provider, BrowserProvider, JsonRpcSigner} from "ethers"
import { WalletResponse } from "../types/wallet-response";
import { ErrorCodes } from "../utils/errors";

let provider: BrowserProvider;
let signer: JsonRpcSigner;
let address: string;


declare global {
    interface Window {
        ethereum?: Eip1193Provider
    }
}

export const getAddress = (): string => {
    if (!address) {
        console.error(ErrorCodes.WALLET_ADDRESS_ERROR);
    }
    return address;
}

export const getSigner = (): JsonRpcSigner => {
    if (!signer) {
        console.error(ErrorCodes.WALLET_SIGNER_ERROR);
    }
    return signer;
}


export const getProvider = (): BrowserProvider => {
    if (!provider) {
        console.error(ErrorCodes.NO_PROVIDERS);
    }
    return provider
}

export const connect = async(): Promise<WalletResponse | undefined> => {
    if (!window.ethereum) {
        console.error(ErrorCodes.CONNECT_ERROR);
        return;
    }
    
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    address = await signer.getAddress();

    return {address, signer, provider}
}

export const isConnected = (): boolean => {
    return !!address && !!signer && !!provider;
}