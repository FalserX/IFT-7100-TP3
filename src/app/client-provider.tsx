"use client";

import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import PopupDialog from "@/components/popup-dialog/popup-dialog";
import ToastNotification from "@/components/toast-notifications/toast-notifications";
import { AppUIContextProvider } from "@/contexts/app-ui-context";
import { ReactNode } from "react";
import ClientLayout from "./[locale]/Client-layout";
import { Metadata } from "next";
import { ContractProvider } from "@/contexts/contract-context";
import { CartProvider } from "@/contexts/cart-context";
import { ToastNotificationProvider } from "@/contexts/toast-notification-context";

export default function ClientProvider({
  children,
  metadata,
}: {
  children: ReactNode;
  metadata: Metadata;
}) {
  return (
    <AppUIContextProvider
      LoadingSpinner={LoadingSpinner}
      PopupDialog={PopupDialog}
      ToastNotif={ToastNotification}
      siteName={metadata.title ? (metadata.title as string) : ""}
    >
      <ContractProvider>
        <ToastNotificationProvider>
          <CartProvider>
            <ClientLayout metadata={metadata}>{children}</ClientLayout>
          </CartProvider>
        </ToastNotificationProvider>
      </ContractProvider>
    </AppUIContextProvider>
  );
}
