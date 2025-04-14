"use client";
import Loading from "@/components/loading/loading";
import renderTranslate from "@/utils/renderTranslate";
import { useEffect, useState } from "react";

export default function OrdersOrderPage({
  currentLocale,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: {
  currentLocale: string;
  loadingFallback?: React.ReactNode;
}) {
  const [orderTitle, setOrderTitle] = useState<string>();

  useEffect(() => {
    const getFetchTranslations = async (message: string, locale: string) => {
      return renderTranslate(message, locale);
    };
    getFetchTranslations("orders.title", currentLocale).then((res) => {
      setOrderTitle(res);
    });
  }, [currentLocale]);
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">
        {!orderTitle ? orderTitle : loadingFallback}
      </h2>
    </main>
  );
}
