"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  error: Error;
};

const GlobalError = ({ error }: Props) => {
  const router = useRouter();

  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-red-600">
        {"errors.error.page.title"}
      </h2>
      <p className="mt-4 text-sm text-gray-600">{error.message}</p>
      <button
        onClick={handleBack}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {"errors.error.page.btn.previous.label"}
      </button>
    </div>
  );
};

export default GlobalError;
