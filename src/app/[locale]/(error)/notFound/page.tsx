"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/locale-context";
const NotFoundPage = () => {
  const router = useRouter();
  const { getLocaleString } = useLocale();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-yellow-600">
        {getLocaleString("errors.notFound.title")}
      </h1>
      <p className="mt-2">{getLocaleString("errors.notFound.description")}</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {getLocaleString("errors.notFound.btn.back.label")}
      </button>
    </div>
  );
};

export default NotFoundPage;
