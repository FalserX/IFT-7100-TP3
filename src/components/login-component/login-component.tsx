import { useContractContext } from "@/contexts/contract-context";
import { useWallet } from "@/contexts/wallet-context";
import { useEffect } from "react";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import {
  concat,
  keccak256,
  MessagePrefix,
  recoverAddress,
  toUtf8Bytes,
} from "ethers";

const LoginComponent = () => {
  const {
    connectMetaMask,
    address,
    loading: walletLoading,
    signer,
  } = useWallet();
  const { contract, loading: contractLoading } = useContractContext();

  useEffect(() => {
    if (address) {
      console.log("user connected with address : ", address);
    }
  }, [address]);

  const hashMessage = (message: Uint8Array | string): string => {
    if (typeof message === "string") {
      message = toUtf8Bytes(message);
    }
    return keccak256(
      concat([
        toUtf8Bytes(MessagePrefix),
        toUtf8Bytes(String(message.length)),
        message,
      ])
    );
  };

  const handleLogin = async () => {
    if (address && contract) {
      try {
        const message = `Sign to access Fruits inc. cart and products: currentDate: ${new Date().toISOString()}`;
        const signature = await signer?.signMessage(message);
        const digest = hashMessage(message);
        if (signature) {
          const result = recoverAddress(digest, signature);
          return result;
        } else {
          throw new Error("Signature is undefined");
        }
      } catch (err) {
        console.log("An error occured when logging in : ", err);
        return;
      }
    }
  };

  if (walletLoading || contractLoading) {
    return (
      <div>
        <LoadingSpinner color="#FFF" size={16} />
      </div>
    );
  }
  return (
    <div>
      {!address ? (
        <button
          onClick={connectMetaMask}
        >{`users.user.connect.metamask`}</button>
      ) : (
        <div>
          <p>{`users.user.connect.connected : ${address}`}</p>
          <button onClick={handleLogin}></button>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
