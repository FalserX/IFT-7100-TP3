import { BrowserProvider, JsonRpcSigner } from "ethers";

export type WalletResponse = {
  address?: string;
  signer?: JsonRpcSigner;
  provider?: BrowserProvider;
};
export enum WalletErrorType {
  NO_PROVIDERS = "errors.wallet.no-providers",
  CONNECT_USER_REJECT = "errors.wallet.connect-user-reject",
  CONNECT_ERROR = "errors.wallet.connect-error",
  INSUFFICIENT_FUNDS = "errors.wallet.insufficient-funds",
  WALLET_ADDRESS_ERROR = "errors.wallet.address-error",
  WALLET_SIGNER_ERROR = "errors.wallet.signer-error",
  WALLET_NO_WINDOW_ERROR = "errors.wallet.no-window-error",
  OTHER = "errors.ask-admin-error",
}

export type WalletType = {
  address: string;
  signer: JsonRpcSigner;
  provider: BrowserProvider;
};
