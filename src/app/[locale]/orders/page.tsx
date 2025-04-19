"use client";

import { useLocale } from "@/contexts/locale-context";

export default function OrdersPage() {
  const { getLocaleString } = useLocale();
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">
        {getLocaleString("orders.title")}
      </h2>
    </main>
  );
}
