"use client";
import { useParams, usePathname } from "next/navigation";
import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";

const supportedLanguages = ["fr", "en"] as const;

const LanguageSwitcher = (): JSX.Element => {
  const params = useParams();
  const pathname = usePathname();

  const currentLocale = params.locale ? (params.locale as string) : "fr";
  const otherLocales = supportedLanguages.filter(
    (loc) => loc !== currentLocale
  );

  const getPathForLocale = (newLocale: string) => {
    if (!pathname.startsWith(`/${currentLocale}`)) return `/${newLocale}`;
    return pathname.replace(`/${currentLocale}`, `/${newLocale}`);
  };

  return (
    <div className="flex border-2 border-white min-w-fit min-h-12 rounded-xl px-3 py-1">
      <Image
        alt="GlobeLangue"
        src={"/globe.svg"}
        className="sepia mr-3"
        width={16}
        height={16}
      />
      {otherLocales.map((locale) => {
        return (
          <Link key={locale} href={getPathForLocale(locale)} className="  mt-1">
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
