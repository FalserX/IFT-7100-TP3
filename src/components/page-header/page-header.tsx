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
import { BannerType } from "../banner-descriptor/banner-descriptor";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../language-switcher/language-switcher";
import { useParams } from "next/navigation";

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
  setBannerActive: Dispatch<SetStateAction<boolean>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
) => {
  try {
    const walletResult = await connect();
    if (!walletResult) {
      setWalletResponse(undefined);
    } else if (
      typeof walletResult === "string" &&
      walletResult.includes("errors")
    ) {
      setWalletResponse(undefined);
      setError(`${t(`${walletResult}`)}`);
      setBannerType(BannerType.ERROR);
      setBannerActive(true);
    } else {
      setWalletResponse(walletResult as WalletResponse);
      localStorage.setItem("walletDisconnect", "false");
    }
  } catch (err) {
    setError(`${t("errors.ask-admin-error")} ${err}`);
    setBannerType(BannerType.ERROR);
    setBannerActive(true);
    console.error(`${t("errors.ask-admin-error")} ${err}`, err);
  }
};

const disconnectAction = async (
  setError: Dispatch<SetStateAction<string>>,
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>,
  setBannerType: Dispatch<SetStateAction<BannerType>>,
  setBannerActive: Dispatch<SetStateAction<boolean>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
) => {
  try {
    const walletResult = await disconnect();
    if (!walletResult) {
      setWalletResponse(undefined);
      localStorage.setItem("walletDisconnect", "true");
    } else {
      setBannerActive(true);
      setBannerType(BannerType.ERROR);
      setError(`${t(`${walletResult}`)}`);
    }
  } catch (err) {
    console.error(`${t("errors.connect-error")}`, err);
    setError(`${t("errors.connect-error")}`);
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
  const params = useParams();
  const currentLocale = params?.locale ? (params.locale as string) : "fr";
  const t = useTranslations();
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
        <PageLogo
          siteName={siteName}
          href={`/${currentLocale}`}
          imgAlt={`${t("client-layout.btn-logo-alt")}`}
          imgSrc={`/Logo.svg`}
          tooltip={`${t("client-layout.btn-logo-tooltip")}`}
        />
        <PageCurrent pageName={pageName} />
        <LanguageSwitcher
          imgAlt={`${t("language-switch.btn-alt")}`}
          imgSrc={`/Globe.svg`}
          tooltip={`${t("language-switch.btn-tooltip")}`}
        />
        <AccountDropdownMenu>
          <>
            {isConnected() ? (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt={`${t(
                    "account-dropdown.account-dropdown-item.wallet.btn-alt"
                  )}`}
                  buttonIconSrc="/Wallet.svg"
                  label={`${t(
                    "account-dropdown.account-dropdown-item.wallet.btn-label"
                  )} ${walletResponse?.address.substring(0, 15)}...`}
                  onClick={() => {}}
                  tooltip={`${t(
                    "account-dropdown.account-dropdown-item.wallet.btn-tooltip"
                  )}`}
                />
                <AccountDropdownItemButton
                  buttonIconAlt={`${t(
                    "account-dropdown.account-dropdown-item.basket.btn-empty-alt"
                  )}`}
                  buttonIconSrc="/EmptyBasket.svg"
                  label={`${t(
                    "account-dropdown.account-dropdown-item.basket.btn-label"
                  )}`}
                  tooltip={`${t(
                    "account-dropdown.account-dropdown-item.basket.btn-empty-tooltip"
                  )}`}
                  href={`/${currentLocale}/basket`}
                />
                <AccountDropdownItemButton
                  buttonIconAlt={`${t(
                    "account-dropdown.account-dropdown-item.commands.btn-alt"
                  )}`}
                  buttonIconSrc="/list.svg"
                  label={`${t(
                    "account-dropdown.account-dropdown-item.commands.btn-label"
                  )}`}
                  tooltip={`${t(
                    "account-dropdown.account-dropdown-item.commands.btn-tooltip"
                  )}`}
                  href={`/${currentLocale}/commands`}
                />
                <AccountDropdownItemButton
                  buttonIconAlt={`${t(
                    "account-dropdown.account-dropdown-item.logout.btn-alt"
                  )}`}
                  buttonIconSrc="/Exit.svg"
                  label={`${t(
                    "account-dropdown.account-dropdown-item.logout.btn-label"
                  )}`}
                  tooltip={`${t(
                    "account-dropdown.account-dropdown-item.logout.btn-tooltip"
                  )}`}
                  onClick={async () =>
                    disconnectAction(
                      setError,
                      setWalletResponse,
                      setBannerType,
                      setBannerActive,
                      t
                    )
                  }
                />
              </>
            ) : (
              <>
                <AccountDropdownItemButton
                  buttonIconAlt={`${t(
                    "account-dropdown.account-dropdown-item.login.btn-alt"
                  )}`}
                  buttonIconSrc="/Enter.svg"
                  label={`${t(
                    "account-dropdown.account-dropdown-item.login.btn-label"
                  )}`}
                  tooltip={`${t(
                    "account-dropdown.account-dropdown-item.login.btn-tooltip"
                  )}`}
                  onClick={async () => {
                    await connectAction(
                      setError,
                      setWalletResponse,
                      setBannerType,
                      setBannerActive,
                      t
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
