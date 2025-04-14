"use client";
import Loading from "@/components/loading/loading";
import renderTranslate from "@/utils/renderTranslate";
import { useEffect, useState } from "react";

export default function OrdersPage({
  currentLocale,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: {
  currentLocale: string;
  loadingFallback: React.ReactNode;
}) {
  const [ordersTitle, setOrdersTitle] = useState<string>();
  useEffect(() => {
    const getFetchTranslations = async (key: string, locale: string) => {
      return await renderTranslate(key, locale);
    };
    getFetchTranslations("orders.title", currentLocale).then((res) => {
      setOrdersTitle(res);
    });
  }, [currentLocale]);
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">
        {ordersTitle ? ordersTitle : loadingFallback}
      </h2>
    </main>
  );
}
