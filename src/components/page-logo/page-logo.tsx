"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type PageLogoProps = {
  siteName: string;
  href: string;
};

const PageLogo = ({ siteName, href }: PageLogoProps) => {
  const params = useParams();
  const currentLocale = params?.locale ? (params.locale as string) : "fr";
  return (
    <Link
      href={href}
      locale={currentLocale}
      className="inline-flex justify-center items-center"
    >
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt="LogoMagasin"
        src="/Logo.svg"
        width={32}
        height={32}
      />
      <p className="ml-5">{siteName}</p>
    </Link>
  );
};

export default PageLogo;
