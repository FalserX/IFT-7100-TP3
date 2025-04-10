import { BrowserProvider, JsonRpcSigner } from "ethers"

export type WalletResponse = {
    address: string,
    signer: JsonRpcSigner,
    provider: BrowserProvider
}