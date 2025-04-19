"use client";

import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import PopupDialog from "@/components/popup-dialog/popup-dialog";
import ToastNotification from "@/components/toast-notifications/toast-notifications";
import { AppUIContextProvider } from "@/contexts/app-ui-context";
import { ReactNode } from "react";
import ClientLayout from "./[locale]/Client-layout";
import { Metadata } from "next";
import { CartContextProvider } from "@/contexts/cart-context";

export default function ClientProvider({
  children,
  metadata,
}: {
  children: ReactNode;
  metadata: Metadata;
}) {
  return (
    <CartContextProvider>
      <AppUIContextProvider
        LoadingSpinner={LoadingSpinner}
        PopupDialog={PopupDialog}
        ToastNotif={ToastNotification}
        siteName={metadata.title ? (metadata.title as string) : ""}
      >
        <ClientLayout metadata={metadata}>{children}</ClientLayout>
      </AppUIContextProvider>
    </CartContextProvider>
  );
}
