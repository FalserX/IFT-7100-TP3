"use client";
import Image from "next/image";
import Link from "next/link";

type PageLogoProps = {
  siteName: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  tooltip?: string;
};

const PageLogo = ({
  siteName,
  href,
  tooltip,
  imgAlt,
  imgSrc,
}: PageLogoProps) => {
  return (
    <Link
      href={href}
      className={`inline-flex ${
        tooltip ? "relative group" : ""
      } justify-center items-center`}
    >
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt={imgAlt}
        src={imgSrc}
        width={32}
        height={32}
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
      <span className="ml-5">{siteName}</span>
    </Link>
  );
};

export default PageLogo;
