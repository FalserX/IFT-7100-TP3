"use client";
import Image from "next/image";

type PageLogoProps = {
  siteName: string;
};

const PageLogo = ({ siteName }: PageLogoProps) => {
  return (
    <div className="inline-flex justify-center items-center">
      <Image
        className="size-12 shadow-2xl rounded-2xl items-center justify-center"
        alt="LogoMagasin"
        src="/nextLogo.svg"
        width={32}
        height={32}
      />
      <p className="ml-5">{siteName}</p>
    </div>
  );
};

export default PageLogo;
