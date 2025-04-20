"use client";

import { useRouter } from "next/navigation";

const BadRequestPage = () => {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">
        {"errors.error.page.badRequest.title"}
      </h1>
      <p className="mt-2">{"errors.error.page.badRequest.description"}</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        {"errors.error.page.badRequest.btn.back.label"}
      </button>
    </div>
  );
};

export default BadRequestPage;
