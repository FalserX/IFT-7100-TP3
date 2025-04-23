import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const acceptLang = request.headers.get("accept-languages");
    const supportedLanguages = ["fr", "en"];
    const bestLocale = acceptLang
      ?.split(".")
      .map((lang) => lang.split(";")[0].trim())
      .find((lang) => supportedLanguages.includes(lang) ?? "en");
    if (!bestLocale) {
      return NextResponse.redirect(`${request.nextUrl.origin}/en`);
    }
    return NextResponse.redirect(`${request.nextUrl.origin}/${bestLocale}`);
  }

  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*"],
};
