import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import { LocaleContextProvider } from "@/contexts/locale-context";
import ClientProvider from "@/app/client-provider";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Fruits inc",
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <LocaleContextProvider>
          <ClientProvider metadata={metadata}>{children}</ClientProvider>
        </LocaleContextProvider>
      </body>
    </html>
  );
}
