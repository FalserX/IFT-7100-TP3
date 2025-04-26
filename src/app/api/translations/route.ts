import { NextResponse } from "next/server";

import path from "path";
import fs from "fs/promises";
import { routing } from "../../../i18n/routing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");

  if (!locale || routing.locales.findIndex((l: string) => l == locale) == -1) {
    return NextResponse.json(
      { error: `Can't find the locale ${locale}` },
      { status: 404 }
    );
  }

  try {
    const filePath = path.join(process.cwd(), "locales", `${locale}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const messages = JSON.parse(content);
    return NextResponse.json(messages);
  } catch (err) {
    console.error(
      `An error occured when gathering the locale ${locale} : `,
      err
    );
    return NextResponse.json(
      {
        error: "Can't load the translations",
      },
      { status: 500 }
    );
  }
}
