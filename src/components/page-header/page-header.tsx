"use client";
import PageLogo from "../page-logo/page-logo";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import {
  connect,
  disconnect,
  getWallet,
  initWallet,
  isConnected,
} from "@/services/wallet";
import { getBasket } from "@/services/basket";
import { WalletResponse } from "@/types/wallet-response";
import { BannerType } from "../banner-descriptor/banner-descriptor";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../language-switcher/language-switcher";
import { useParams } from "next/navigation";

type PageHeaderProps = {
  pageName: string | React.ReactNode;
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
    const walletResult = await connect();
    if (!walletResult) {
      setWalletResponse(undefined);
    } else if (
      typeof walletResult === "string" &&
      walletResult.includes("errors")
    ) {
      setWalletResponse(undefined);
      setError(`${walletResult}`);
      setBannerType(BannerType.ERROR);
      setBannerActive(true);
    } else {
      setWalletResponse(walletResult as WalletResponse);
      localStorage.setItem("walletDisconnect", "false");
    }
  } catch (err) {
    setError(`errors.ask-admin-error |${err}`);
    setBannerType(BannerType.ERROR);
    setBannerActive(true);
    console.error(`errors.ask-admin-error | ${err}`, err);
  }
};

const disconnectAction = async (
  setError: Dispatch<SetStateAction<string>>,
  setWalletResponse: Dispatch<SetStateAction<WalletResponse | undefined>>,
  setBannerType: Dispatch<SetStateAction<BannerType>>,
  setBannerActive: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const walletResult = await disconnect();
    if (!walletResult) {
      setWalletResponse(undefined);
      localStorage.setItem("walletDisconnect", "true");
    } else {
      setBannerActive(true);
      setBannerType(BannerType.ERROR);
      setError(`${walletResult}`);
    }
  } catch (err) {
    console.error(`errors.connect-error`, err);
    setError(`errors.connect-error`);
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
      if (isConnected()) {
        const walletRespon = await getWallet();
        if (
          walletRespon.toString().includes("ask") ||
          walletRespon.toString().includes("errors")
        ) {
          setBannerActive(true);
          setBannerType(BannerType.ERROR);
          setError(walletRespon.toString());
        }
        setWalletResponse(walletRespon as WalletResponse);
      }
    };
    if (!walletResponse) {
      inWallet();
    }
  }, [
    setWalletResponse,
    walletResponse,
    setBannerActive,
    setBannerType,
    setError,
    t,
  ]);
  return (
    <header className="flex w-full flex-col grow rounded-2xl bg-gray-700">
      <div className="flex flex-row gap-6 items-center p-2 pl-5 pr-5 pt-5">
        <PageLogo
          currentLocale={currentLocale}
          siteName={siteName}
          href={`/${currentLocale}`}
          imgAlt={`client-layout.btn-logo-alt`}
          imgSrc={`/Logo.svg`}
          tooltip={`client-layout.btn-logo-tooltip`}
        />
        <div className="flex grow justify-center items-center font-bold">
          <span>{pageName}</span>
        </div>
        <div className="flex gap-6 justify-end">
          <LanguageSwitcher
            currentLocale={currentLocale}
            imgAlt={`language-switch.btn-alt`}
            imgSrc={`/Globe.svg`}
            tooltip={`language-switch.btn-tooltip`}
          />
          <AccountDropdownMenu currentLocale={currentLocale}>
            <>
              {isConnected() ? (
                <>
                  <AccountDropdownItemButton
                    currentLocale={currentLocale}
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.wallet.btn-alt"
                    }
                    buttonIconSrc="/Wallet.svg"
                    label={`account-dropdown.account-dropdown-item.wallet.btn-label|${walletResponse?.address.substring(
                      0,
                      15
                    )}...`}
                    tooltip={
                      "account-dropdown.account-dropdown-item.wallet.btn-tooltip"
                    }
                  />
                  <AccountDropdownItemButton
                    currentLocale={currentLocale}
                    buttonIconAlt={`${
                      getBasket().products.length > 0
                        ? "account-dropdown.account-dropdown-item.basket.btn-full-alt"
                        : "account-dropdown.account-dropdown-item.basket.btn-empty-alt"
                    }`}
                    buttonIconSrc="/EmptyBasket.svg"
                    label={
                      "account-dropdown.account-dropdown-item.basket.btn-label"
                    }
                    tooltip={`${
                      getBasket().products.length > 0
                        ? "account-dropdown.account-dropdown-item.basket.btn-full-tooltip"
                        : "account-dropdown.account-dropdown-item.basket.btn-empty-tooltip"
                    }`}
                    href={`/${currentLocale}/basket`}
                  />
                  <AccountDropdownItemButton
                    currentLocale={currentLocale}
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.orders.btn-alt"
                    }
                    buttonIconSrc="/list.svg"
                    label={
                      "account-dropdown.account-dropdown-item.orders.btn-label"
                    }
                    tooltip={
                      "account-dropdown.account-dropdown-item.orders.btn-tooltip"
                    }
                    href={`/${currentLocale}/orders`}
                  />
                  <AccountDropdownItemButton
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.logout.btn-alt"
                    }
                    currentLocale={currentLocale}
                    buttonIconSrc="/Exit.svg"
                    label={
                      "account-dropdown.account-dropdown-item.logout.btn-label"
                    }
                    tooltip={
                      "account-dropdown.account-dropdown-item.logout.btn-tooltip"
                    }
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
                    currentLocale={currentLocale}
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.login.btn-alt"
                    }
                    buttonIconSrc="/Enter.svg"
                    label={
                      "account-dropdown.account-dropdown-item.login.btn-label"
                    }
                    tooltip={
                      "account-dropdown.account-dropdown-item.login.btn-tooltip"
                    }
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
