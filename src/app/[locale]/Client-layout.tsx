"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageFooter from "@/components/page-footer/page-footer";
import React from "react";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";
import { Metadata } from "next";
import PageHeader from "@/components/page-header/page-header";
import { ToastNotificationProvider } from "@/contexts/toast-notification-context";
import { ContractProvider } from "@/contexts/contract-context";
import { WalletProvider } from "@/contexts/wallet-context";
import { CartProvider } from "@/contexts/cart-context";

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
  const { setPageName } = useAppUI();
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
      <ToastNotificationProvider>
        <WalletProvider>
          <ContractProvider>
            <CartProvider>
              <PageHeader />
              {children}
              <PageFooter />
            </CartProvider>
          </ContractProvider>
        </WalletProvider>
      </ToastNotificationProvider>
    </div>
  );
};

export default ClientLayout;
