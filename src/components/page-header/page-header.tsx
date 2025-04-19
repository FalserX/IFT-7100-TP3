"use client";
import PageLogo from "../page-logo/page-logo";
import { useWalletResponse } from "@/contexts/wallet-context";
import AccountDropdownMenu, {
  AccountDropdownItemButton,
} from "../account-dropdown-menu/account-dropdown-menu";
import { useCallback, useEffect, useRef } from "react";
import LanguageSwitcher from "../language-switcher/language-switcher";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { useCart } from "@/contexts/cart-context";
import { WalletErrorType } from "@/types/wallet-response";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";
import { NotifType } from "@/types/notification";

//#region walletResponse
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

//#endregion

const PageHeader = () => {
  const {
    setWalletAddress,
    setWalletErrorType,
    setWalletProvider,
    setWalletResponse,
    setWalletSigner,
    walletAddress,
    walletResponse,
  } = useWalletResponse();
  //#region walletResponse
  const { cart } = useCart();
  const {
    LoadingSpinner,
    pageName,
    ToastNotif,
    notifMessage,
    notifType,
    notifActive,
    setNotifMessage,
    setNotifType,
    setNotifActive,
  } = useAppUI();
  const { currentLocale, getLocaleString } = useLocale();
  const isConnectingRef = useRef<boolean>(false);

  const disconnectWalletResponse = () => {
    if (!window.ethereum) {
      console.error(getLocaleString(WalletErrorType.WALLET_NO_WINDOW_ERROR));
      setWalletErrorType(WalletErrorType.WALLET_NO_WINDOW_ERROR);
      setNotifMessage?.(WalletErrorType.WALLET_NO_WINDOW_ERROR);
      setNotifActive?.(true);
      setNotifType?.(NotifType.ERROR);
    }
    setWalletResponse(undefined);
    setWalletProvider(undefined);
    setWalletSigner(undefined);
    setWalletAddress(undefined);
    localStorage.setItem("wallet-response-disconnect", "true");
  };
  const connectWalletResponse = useCallback(async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;
    if (localStorage.getItem("wallet-response-disconnect")) {
      localStorage.removeItem("wallet-response-disconnect");
    }
    if (!window.ethereum) {
      console.error(getLocaleString(WalletErrorType.WALLET_NO_WINDOW_ERROR));
      setWalletErrorType(WalletErrorType.WALLET_NO_WINDOW_ERROR);
      setNotifMessage?.(WalletErrorType.WALLET_NO_WINDOW_ERROR);
      setNotifType?.(NotifType.ERROR);
      setNotifActive?.(true);
      return;
    }
    try {
      const walletProvider = new BrowserProvider(
        window.ethereum as Eip1193Provider
      );
      const walletSigner = await walletProvider.getSigner();
      const walletAddress = await walletSigner.getAddress();
      setWalletProvider(walletProvider);
      setWalletSigner(walletSigner);
      setWalletAddress(walletAddress);
      setWalletResponse({
        address: walletAddress,
        provider: walletProvider,
        signer: walletSigner,
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).code === "ACTION_REJECTED") {
        setWalletErrorType(WalletErrorType.CONNECT_USER_REJECT);
        setNotifMessage?.(WalletErrorType.CONNECT_USER_REJECT);
        setNotifType?.(NotifType.INFO);
      } else {
        console.error(getLocaleString(WalletErrorType.CONNECT_ERROR), err);
        setWalletErrorType(WalletErrorType.CONNECT_ERROR);
        setNotifMessage?.(WalletErrorType.CONNECT_ERROR);
        setNotifType?.(NotifType.ERROR);
      }
      setNotifActive?.(true);
    } finally {
      isConnectingRef.current = false;
    }
  }, [
    setWalletErrorType,
    setWalletAddress,
    setWalletProvider,
    setWalletSigner,
    setWalletResponse,
    setNotifActive,
    setNotifMessage,
    setNotifType,
    getLocaleString,
  ]);
  //#endregion

  useEffect(() => {
    const initWalletResponse = () => {
      if (
        !walletResponse &&
        !localStorage.getItem("wallet-response-disconnect")
      ) {
        connectWalletResponse();
      }
    };

    initWalletResponse();
  }, [connectWalletResponse, walletResponse]);
  return (
    <header className="flex w-full flex-col grow rounded-2xl">
      <div className="flex flex-row gap-6 items-center p-2 pl-5 pr-5 pt-5">
        <PageLogo
          href={`/${currentLocale}`}
          imgAlt={`client-layout.btn-logo-alt`}
          imgSrc={`/Logo.svg`}
          tooltip={`client-layout.btn-logo-tooltip`}
        />
        <div className="flex grow justify-center items-center font-bold">
          <span>
            {pageName
              ? pageName
              : LoadingSpinner && <LoadingSpinner size={32} />}
          </span>
        </div>
        <div className="flex gap-6 justify-end">
          <LanguageSwitcher
            imgAlt={`language-switch.btn-alt`}
            imgSrc={`/Globe.svg`}
            tooltip={`language-switch.btn-tooltip`}
          />
          <AccountDropdownMenu>
            <>
              {walletResponse ? (
                <>
                  <AccountDropdownItemButton
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.wallet.btn-alt"
                    }
                    buttonIconSrc="/Wallet.svg"
                    label={`account-dropdown.account-dropdown-item.wallet.btn-label|${
                      walletAddress ? walletAddress.substring(0, 15) : ""
                    }...`}
                    tooltip={
                      "account-dropdown.account-dropdown-item.wallet.btn-tooltip"
                    }
                  />
                  <AccountDropdownItemButton
                    buttonIconAlt={`${
                      cart.products.length > 0
                        ? "account-dropdown.account-dropdown-item.cart.btn-full-alt"
                        : "account-dropdown.account-dropdown-item.cart.btn-empty-alt"
                    }`}
                    buttonIconSrc={`${
                      cart.products.length > 0
                        ? "/Fillcart.svg"
                        : "/Emptycart.svg"
                    }`}
                    label={
                      "account-dropdown.account-dropdown-item.cart.btn-label"
                    }
                    tooltip={`${
                      cart.products.length > 0
                        ? "account-dropdown.account-dropdown-item.cart.btn-full-tooltip"
                        : "account-dropdown.account-dropdown-item.cart.btn-empty-tooltip"
                    }`}
                    href={`/${currentLocale}/cart`}
                  />
                  <AccountDropdownItemButton
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
                    buttonIconSrc="/Exit.svg"
                    label={
                      "account-dropdown.account-dropdown-item.logout.btn-label"
                    }
                    tooltip={
                      "account-dropdown.account-dropdown-item.logout.btn-tooltip"
                    }
                    onClick={disconnectWalletResponse}
                  />
                </>
              ) : (
                <>
                  <AccountDropdownItemButton
                    disabled={isConnectingRef.current}
                    buttonIconAlt={
                      "account-dropdown.account-dropdown-item.login.btn-alt"
                    }
                    buttonIconSrc="/Enter.svg"
                    label={
                      "account-dropdown.account-dropdown-item.login.btn-label"
                    }
                    tooltip={
                      isConnectingRef
                        ? "account-dropdown.account-dropdown-item.login.btn-tooltip-disabled"
                        : "account-dropdown.account-dropdown-item.login.btn-tooltip"
                    }
                    onClick={() => {
                      if (!walletResponse) {
                        connectWalletResponse();
                      }
                    }}
                  />
                </>
              )}
            </>
          </AccountDropdownMenu>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row grow p-5 items-center">
          <button className="flex border-2 border-white min-w-fit min-h-12 rounded-xl">
            TEST
          </button>
        </div>
        {ToastNotif && (
          <ToastNotif
            active={notifActive}
            notifMessage={notifMessage}
            notifType={notifType}
          />
        )}
      </div>
    </header>
  );
};

export default PageHeader;
