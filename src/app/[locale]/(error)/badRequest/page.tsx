"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/locale-context";

const BadRequestPage = () => {
  const router = useRouter();
  const { getLocaleString } = useLocale();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">
        {`${getLocaleString("errors.badRequest.title")}`}
      </h1>
      <p className="mt-2">{`${getLocaleString(
        "errors.badRequest.description"
      )}`}</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        {`${getLocaleString("errors.badRequest.btn.back.label")}`}
      </button>
    </div>
  );
};

export default BadRequestPage;
