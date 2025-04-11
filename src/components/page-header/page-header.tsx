"use client";
import PageLogo from "../page-logo/page-logo";
import PageCurrent from "../page-current/page-current";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import { connect, disconnect, isConnected } from "@/services/wallet";
import { WalletResponse } from "@/types/wallet-response";
import { ErrorCodes } from "@/utils/errors";
import { BannerType } from "../banner-descriptor/banner-descriptor";
import { Dispatch, SetStateAction } from "react";

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
    setWalletResponse(await connect());
  } catch (err) {
    setError(ErrorCodes.CONNECT_ERROR);
    setBannerType(BannerType.ERROR);
    setBannerActive(true);
    console.error(ErrorCodes.CONNECT_ERROR, err);
  }
};

const disconnectAction = (
  setError: Dispatch<SetStateAction<string>>,
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>,
  setBannerType: Dispatch<SetStateAction<BannerType>>,
  setBannerActive: Dispatch<SetStateAction<boolean>>
) => {
  try {
    disconnect();
    setWalletResponse(undefined);
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
  return (
    <header className="flex flex-col gap-6 items-center p-7 md:flex-row md:gap-12 rounded-2xl bg-gray-700">
      <PageLogo siteName={siteName} />
      <PageCurrent pageName={pageName} />
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
                onClick={() => {}}
              />
              <AccountDropdownItemButton
                buttonIconAlt="Icone Commandes"
                buttonIconSrc="/list.svg"
                label="Vos commandes"
                onClick={() => {}}
              />
              <AccountDropdownItemButton
                buttonIconAlt="Icone Déconnexion"
                buttonIconSrc="/Exit.svg"
                label="Se déconnecter"
                onClick={() =>
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
                onClick={async () =>
                  connectAction(
                    setError,
                    setWalletResponse,
                    setBannerType,
                    setBannerActive
                  )
                }
              />
            </>
          )}
        </>
      </AccountDropdownMenu>
    </header>
  );
};

export default PageHeader;
