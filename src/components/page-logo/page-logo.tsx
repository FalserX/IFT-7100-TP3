"use client";
import renderTranslate from "@/utils/renderTranslate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type PageLogoProps = {
  siteName: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  tooltip?: string;
  currentLocale: string;
};

const PageLogo = ({
  siteName,
  href,
  tooltip,
  imgAlt,
  imgSrc,
  currentLocale,
}: PageLogoProps) => {
  const [imageAlt, setImageAlt] = useState<string>("");
  const [tooltipT, setTooltipT] = useState<string>("");

  useEffect(() => {
    const getFetchTranslations = async (key: string, locale: string) => {
      return await renderTranslate(key, locale);
    };
    getFetchTranslations(imgAlt, currentLocale).then((res) => setImageAlt(res));
    if (tooltip) {
      getFetchTranslations(tooltip, currentLocale).then((res) =>
        setTooltipT(res)
      );
    }
  }, [imgAlt, tooltip, currentLocale]);
  return (
    <Link
      href={href}
      className={`inline-flex ${
        tooltip ? "relative group" : ""
      } justify-start items-center font-bold hover:underline `}
    >
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt={imageAlt}
        src={imgSrc}
        width={32}
        height={32}
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
      <span className="ml-5">{siteName}</span>
    </Link>
  );
};

export default PageLogo;
