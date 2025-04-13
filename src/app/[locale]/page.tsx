import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">{t("test")}</h2>
    </main>
  );
}
