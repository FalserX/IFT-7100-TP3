"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/locale-context";

const ServerErrorPage = () => {
  const router = useRouter();
  const { getLocaleString } = useLocale();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-200">
        {getLocaleString("errors.serverError.title")}
      </h1>
      <p className="mt-2">
        {getLocaleString("errors.serverError.description")}
      </p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {getLocaleString("errors.serverError.btn.back.label")}
      </button>
    </div>
  );
};

export default ServerErrorPage;
