"use client";

import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-yellow-600">
        {"errors.error.page.notFound.title"}
      </h1>
      <p className="mt-2">{"errors.error.page.notFound.description"}</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {"errors.error.page.notFound.btn.back.label"}
      </button>
    </div>
  );
};

export default NotFoundPage;
