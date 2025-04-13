import { useTranslations } from "next-intl";

export default function BasketPage() {
  const t = useTranslations();
  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-black">{`${t("basket.content")}`}</h2>
    </main>
  );
}
