import type { Metadata } from "next";
import "@/app/globals.css";
import ClientLayout from "./Client-layout";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export const metadata: Metadata = {
  title: "Fruits inc",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const currentLocale = params.locale || "fr";
  let messages;

  try {
    messages = await getMessages({ locale: currentLocale });
  } catch (error) {
    console.log(error);
    notFound();
  }
  return (
    <html lang={currentLocale}>
      <body>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <ClientLayout metadata={metadata}>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
