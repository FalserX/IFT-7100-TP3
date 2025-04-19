"use client";
import { useLocale } from "@/contexts/locale-context";
import Image from "next/image";
import Link from "next/link";
import { useAppUI } from "@/contexts/app-ui-context";

type PageLogoProps = {
  href: string;
  imgSrc: string;
  imgAlt: string;
  tooltip?: string;
  loadingFallback?: React.ReactNode;
};

const PageLogo = ({ href, tooltip, imgAlt, imgSrc }: PageLogoProps) => {
  const { getLocaleString } = useLocale();
  const { siteName, LoadingSpinner, popupActive } = useAppUI();

  return popupActive ? (
    <>
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt={imgAlt && getLocaleString(imgAlt)}
        src={imgSrc}
        width={32}
        height={32}
      />
      {tooltip ? (
        <span
          className={`absolute top-full left-0 w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {getLocaleString(tooltip)}
        </span>
      ) : (
        LoadingSpinner && <LoadingSpinner size={16} />
      )}
      <span className="ml-5">{siteName}</span>
    </>
  ) : (
    <Link
      href={href}
      className={`inline-flex ${
        tooltip ? "relative group" : ""
      } justify-start items-center font-bold hover:underline `}
    >
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt={imgAlt && getLocaleString(imgAlt)}
        src={imgSrc}
        width={32}
        height={32}
      />
      {tooltip ? (
        <span
          className={`absolute top-full left-0 w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {getLocaleString(tooltip)}
        </span>
      ) : (
        LoadingSpinner && <LoadingSpinner size={16} />
      )}
      <span className="ml-5">{siteName}</span>
    </Link>
  );
};

export default PageLogo;
