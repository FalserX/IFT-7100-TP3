"use client";

import { usePathname, useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);
  const locale = ["fr", "en"].includes(pathname?.split("/")[1]) || "en";
  console.log(locale);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-500">
        {"errors.error.page.not-found.title"}
      </h1>
      <p className="mt-2">{"errors.error.page.not-found.description"}</p>
      <button
        onClick={() => router.push(`${window.location.origin}/${locale}`)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        {"errors.error.page.not-found.btn.home.label"}
      </button>
    </div>
  );
};

export default NotFoundPage;
