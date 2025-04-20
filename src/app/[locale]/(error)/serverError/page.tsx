"use client";

import { useRouter } from "next/navigation";

const ServerErrorPage = () => {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-200">
        {"errors.error.page.serverError.title"}
      </h1>
      <p className="mt-2">{"errors.error.page.serverError.description"}</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {"errors.error.page.serverError.btn.back.label"}
      </button>
    </div>
  );
};

export default ServerErrorPage;
