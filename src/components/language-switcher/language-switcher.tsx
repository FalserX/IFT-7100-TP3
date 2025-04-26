"use client";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react";
import Image from "next/image";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";

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
  const {
    currentLocale,
    getLocaleString,
    getSupportedLanguages,
    getPathForLocale,
  } = useLocale();
  const { LoadingSpinner } = useAppUI();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocales = getSupportedLanguages().filter(
    (loc) => loc !== currentLocale
  );

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      const newPath = getPathForLocale(pathname, newLocale);
      router.push(newPath);
    }
  };
  return (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl px-3 py-1 items-center hover:underline hover:font-bold hover:cursor-pointer`}
    >
      <Image
        alt={imgAlt && getLocaleString(imgAlt)}
        src={imgSrc}
        className="mr-3 filter brightness-200"
        width={16}
        height={16}
      />
      {tooltip ? (
        <span
          className={`absolute top-full max-w-md left-0 break-words transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {getLocaleString(tooltip)}
        </span>
      ) : (
        LoadingSpinner && <LoadingSpinner size={16} />
      )}
      {otherLocales.map((locale) => {
        return (
          <div key={locale}>
            <button onClick={() => handleLocaleChange(locale)}>
              {locale === "fr" ? "Français" : "English"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
