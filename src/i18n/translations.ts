import fs from "fs/promises";
import path from "path";

export async function getTranslations(
  locale: string,
  namespace = "common"
): Promise<Record<string, string>> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    locale,
    `${namespace}.json`
  );
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file);
}
