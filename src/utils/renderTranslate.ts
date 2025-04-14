"use server";
import { getTranslations } from "next-intl/server";

export default async function renderTranslate(key: string, locale: string) {
  const t = await getTranslations({ locale });
  return key.includes("|") ? t(key.split("|")[0]) + key.split("|")[1] : t(key);
}
