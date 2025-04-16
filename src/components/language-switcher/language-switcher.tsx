"use client";
import { useParams, usePathname } from "next/navigation";
import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";

const supportedLanguages = ["fr", "en"] as const;

type LanguageSwitcherProps = {
  tooltip?: string;
  imgSrc: string;
  imgAlt: string;
};

const LanguageSwitcher = ({
  tooltip,
  imgSrc,
  imgAlt,
}: LanguageSwitcherProps): JSX.Element => {
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
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl px-3 py-1`}
    >
      <Image
        alt={imgAlt}
        src={imgSrc}
        className="mr-3 filter brightness-200"
        width={16}
        height={16}
      />
      {tooltip ? (
        <span
          className={`absolute top-full left-1/2 transform -translate-x-1/2 translate-y-4 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {tooltip}
        </span>
      ) : (
        <></>
      )}
      {otherLocales.map((locale) => {
        return (
          <Link key={locale} href={getPathForLocale(locale)} className="mt-1">
            {locale[0].toUpperCase() + locale[1]}
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
