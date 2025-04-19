"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageFooter from "@/components/page-footer/page-footer";
import React from "react";
import { WalletResponseProvider } from "@/contexts/wallet-context";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";
import { Metadata } from "next";
import { PopupType } from "@/types/popup";
import { AuthProvider } from "@/contexts/auth-context";
import { login } from "@/libs/auth";
import { NavigationGuardProvider } from "@/contexts/navigation-guard-context";

const ClientLayout = ({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata: Metadata;
}) => {
  const [isClient, setIsClient] = useState<boolean>(true);

  const pathname = usePathname();

  const { currentLocale, getLocaleString } = useLocale();
  const {
    setPageName,
    popupAction,
    popupActive,
    PopupDialog,
    popupMessage,
    popupTitle,
    popupType,
  } = useAppUI();
  useEffect(() => {
    setIsClient(true);
    const extractPageKey = (path: string): string => {
      const trimmed = path.replace(`/${currentLocale}`, "").replace(/^\/+/, "");
      if (trimmed === "") {
        return getLocaleString("home.title");
      }

      const parts = trimmed.split("/");
      const pageKey = getLocaleString(`${parts.join(".")}.title`);
      return pageKey;
    };
    const pageKey = extractPageKey(pathname);
    setPageName?.(pageKey);
  }, [
    pathname,
    currentLocale,
    setIsClient,
    getLocaleString,
    setPageName,
    metadata,
  ]);

  if (!isClient) return null;
  return (
    <div className={`bg-gray-700`}>
      <AuthProvider>
        <NavigationGuardProvider>
          <WalletResponseProvider>
            {PopupDialog && (
              <PopupDialog
                popupType={popupType ?? PopupType.INFO}
                popupAction={popupAction}
                popupActive={popupActive}
                popupMessage={popupMessage}
                popupTitle={popupTitle}
              />
            )}
            {children}
            <button
              onClick={() => {
                login();
              }}
            >
              Login
            </button>
            <PageFooter />
          </WalletResponseProvider>
        </NavigationGuardProvider>
      </AuthProvider>
    </div>
  );
};

export default ClientLayout;

/*

const LogoutButton =() => {
const {refreshUser, logout} = useAuth();
const handleLogout = async () =>{
  await logout();
  await refreshUser();
}
  return <button onclick={handleLogout}>Logout</button>
}

*/
