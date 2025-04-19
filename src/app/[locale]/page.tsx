"use client";
import { useLocale } from "@/contexts/locale-context";
export default function Home({ children }: { children: React.ReactNode }) {
  const { getLocaleString } = useLocale();
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">
        {getLocaleString("home.title-header")}
      </h2>
      {children}
    </main>
  );
}
