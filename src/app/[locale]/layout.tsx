import type { Metadata } from "next";
import "@/app/globals.css";
import ClientLayout from "./Client-layout";

export const metadata: Metadata = {
  title: "MON MAGASIN",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const currentLocale = params.locale ? params.locale : "fr";
  return (
    <html lang={currentLocale}>
      <body>
        <ClientLayout metadata={metadata}>{children}</ClientLayout>
      </body>
    </html>
  );
}
