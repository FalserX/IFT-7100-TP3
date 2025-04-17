import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">{t("home.content")}</h2>
    </main>
  );
}
