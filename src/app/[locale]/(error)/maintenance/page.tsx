"use client";
import { useLocale } from "@/contexts/locale-context";
const MaintenancePage = () => {
  const { getLocaleString } = useLocale();
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600">
        {`${getLocaleString("errors.maintenance.title")}`}
      </h1>
      <p className="mt-4">{`${getLocaleString(
        "errors.maintenance.description"
      )}`}</p>
    </div>
  );
};

export default MaintenancePage;
