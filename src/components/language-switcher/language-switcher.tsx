"use client";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import renderTranslate from "@/utils/renderTranslate";

const supportedLanguages = ["fr", "en"] as const;

type LanguageSwitcherProps = {
  tooltip?: string;
  imgSrc: string;
  imgAlt: string;
  currentLocale: string;
};

const LanguageSwitcher = ({
  tooltip,
  imgSrc,
  imgAlt,
  currentLocale,
}: LanguageSwitcherProps): JSX.Element => {
  const [imageAlt, setImageAlt] = useState<string>("");
  const [tooltipT, setTooltipT] = useState<string>("");

  useEffect(() => {
    const getFetchTranslations = async (key: string, locale: string) => {
      return await renderTranslate(key, locale);
    };
    getFetchTranslations(imgAlt, currentLocale).then((res) => {
      setImageAlt(res);
    });
    if (tooltip) {
      getFetchTranslations(tooltip, currentLocale).then((res) => {
        setTooltipT(res);
      });
    }
  }, [currentLocale, imgAlt, tooltip]);
  const pathname = usePathname();

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
      } border-2 border-white min-w-fit min-h-12 rounded-xl px-3 py-1 items-center hover:underline hover:font-bold`}
    >
      <Image
        alt={imageAlt}
        src={imgSrc}
        className="mr-3 filter brightness-200"
        width={16}
        height={16}
      />
      {tooltip ? (
        <span
          className={`absolute top-full left-0 w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {tooltipT}
        </span>
      ) : (
        <></>
      )}
      {otherLocales.map((locale) => {
        return (
          <Link key={locale} href={getPathForLocale(locale)}>
            {locale[0].toUpperCase() + locale[1]}
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
