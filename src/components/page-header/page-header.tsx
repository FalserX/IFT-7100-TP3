"use client";
import PageLogo from "../page-logo/page-logo";
import PageCurrent from "../page-current/page-current";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import {
  connect,
  disconnect,
  initWallet,
  isConnected,
} from "@/services/wallet";
import { WalletResponse } from "@/types/wallet-response";
import { ErrorCodes } from "@/utils/errors";
import { BannerType } from "../banner-descriptor/banner-descriptor";
import { Dispatch, SetStateAction, useEffect } from "react";
import LanguageSwitcher from "../language-switcher/language-switcher";

type PageHeaderProps = {
  pageName: string;
  siteName: string;
  walletResponse: WalletResponse | undefined;
  setBannerActive: Dispatch<SetStateAction<boolean>>;
  setBannerType: Dispatch<SetStateAction<BannerType>>;
  setError: Dispatch<SetStateAction<string>>;
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>;
};

const connectAction = async (
  setError: Dispatch<SetStateAction<string>>,
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>,
  setBannerType: Dispatch<SetStateAction<BannerType>>,
  setBannerActive: Dispatch<SetStateAction<boolean>>
) => {
  try {
    localStorage.setItem("walletDisconnect", "false");
    setWalletResponse(await connect());
  } catch (err) {
    setError(ErrorCodes.CONNECT_ERROR);
    setBannerType(BannerType.ERROR);
    setBannerActive(true);
    console.error(ErrorCodes.CONNECT_ERROR, err);
  }
};

const disconnectAction = async (
  setError: Dispatch<SetStateAction<string>>,
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>,
  setBannerType: Dispatch<SetStateAction<BannerType>>,
  setBannerActive: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setWalletResponse(await disconnect());
    localStorage.setItem("walletDisconnect", "true");
  } catch (err) {
    console.error(ErrorCodes.CONNECT_ERROR, err);
    setError(ErrorCodes.CONNECT_ERROR);
    setBannerType(BannerType.ERROR);
    setBannerActive(true);
  }
};

const PageHeader = ({
  pageName,
  siteName,
  setError,
  setWalletResponse,
  setBannerActive,
  setBannerType,
  walletResponse,
}: PageHeaderProps) => {
  useEffect(() => {
    const inWallet = async () => {
      if (!localStorage.getItem("walletDisconnect")) {
        setWalletResponse(await initWallet());
        localStorage.setItem("walletDisconnect", "false");
      }
    };
    if (!walletResponse) {
      inWallet();
    }
  }, [setWalletResponse, walletResponse]);
  return (
    <header className="flex flex-col grow rounded-2xl bg-gray-700">
      <div className="flex flex-row gap-6 items-center p-2 pl-5 pr-5 pt-5">
        <PageLogo siteName={siteName} href={`/`} />
        <PageCurrent pageName={pageName} />
        <LanguageSwitcher />
        <AccountDropdownMenu dropdownLabel="Votre compte">
          <>
            {isConnected() ? (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt="Icone Portefeuille"
                  buttonIconSrc="/Wallet.svg"
                  label={`Votre portefeuille ${walletResponse?.address.substring(
                    0,
                    15
                  )}...`}
                  onClick={() => {}}
                />
                <AccountDropdownItemButton
                  buttonIconAlt="Icone Panier"
                  buttonIconSrc="/EmptyBasket.svg"
                  label="Votre panier"
                  href="/basket"
                />
                <AccountDropdownItemButton
                  buttonIconAlt="Icone Commandes"
                  buttonIconSrc="/list.svg"
                  label="Vos commandes"
                  href="/commands"
                />
                <AccountDropdownItemButton
                  buttonIconAlt="Icone Déconnexion"
                  buttonIconSrc="/Exit.svg"
                  label="Se déconnecter"
                  onClick={async () =>
                    disconnectAction(
                      setError,
                      setWalletResponse,
                      setBannerType,
                      setBannerActive
                    )
                  }
                />
              </>
            ) : (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt="Icone Connexion"
                  buttonIconSrc="/Enter.svg"
                  label="Se connecter"
                  onClick={async () => {
                    await connectAction(
                      setError,
                      setWalletResponse,
                      setBannerType,
                      setBannerActive
                    );
                  }}
                />
              </>
            )}
          </>
        </AccountDropdownMenu>
      </div>
      <div className="flex flex-row grow p-5 items-center">
        <button className="flex border-2 border-white min-w-fit min-h-12 rounded-xl">
          TEST
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
