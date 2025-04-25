"use client";
import { useLocale } from "@/contexts/locale-context";
import { usePathname, useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { getLocaleString } = useLocale();
  const locale = ["fr", "en"].includes(pathname?.split("/")[1]) || "en";
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-500">
        {getLocaleString("errors.notFound.title")}
      </h1>
      <p className="mt-2">{getLocaleString("errors.notFound.description")}</p>
      <button
        onClick={() => router.push(`${window.location.origin}/${locale}`)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        {getLocaleString("errors.notFound.btn.home.label")}
      </button>
    </div>
  );
};

export default NotFoundPage;
