"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { connect, isConnected, disconnect } from "../../services/wallet";
import { WalletResponse } from "@/types/wallet-response";
import { ErrorCodes } from "@/utils/errors";

type InfoAccountProps = {
  walletResponse: WalletResponse | undefined;
};
type ConnectButtonProps = {
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>;
};
type DisconnectButtonProps = {
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>;
};

const PageLoginSpace = () => {
  const [walletResponse, setWalletResponse] = useState<
    WalletResponse | undefined
  >();
  return (
    <div className="flex flex-row">
      {!isConnected() ? (
        <ConnectButton setWalletResponse={setWalletResponse} />
      ) : (
        <>
          <InfoAccount walletResponse={walletResponse} />
          <DisconnectButton setWalletResponse={setWalletResponse} />
        </>
      )}
    </div>
  );
};
const InfoAccount = ({ walletResponse }: InfoAccountProps) => {
  return (
    <>
      <div>Portefeuille: {walletResponse?.address} connecté</div>
    </>
  );
};
const DisconnectButton = ({ setWalletResponse }: DisconnectButtonProps) => {
  const handleDisconnect = async () => {
    try {
      disconnect();
      setWalletResponse(undefined);
    } catch (error) {
      console.error(ErrorCodes.CONNECT_ERROR, error);
    }
  };
  return <button onClick={handleDisconnect}>Se déconnecter</button>;
};

const ConnectButton = ({ setWalletResponse }: ConnectButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      setWalletResponse(await connect());
      if (isConnected()) {
        setLoading(false);
      }
    } catch (error) {
      console.error(ErrorCodes.CONNECT_ERROR, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleConnect} disabled={loading}>
      {loading ? "Connexion en cours ..." : "Se connecter"}
    </button>
  );
};

export default PageLoginSpace;
