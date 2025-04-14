"use client";
import { getCurrentYear } from "@/utils/dates";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
type PageFooterProps = {
  siteName: string;
};

const PageFooter = ({ siteName }: PageFooterProps) => {
  const t = useTranslations();
  return (
    <div className="bg-gray-700 inline-flex min-w-full rounded-2xl grow">
      <div className="m-2 inline-flex grow">
        &#169; {siteName}, {getCurrentYear()}
      </div>
      <div className="inline-flex grow justify-end relative group mt-3">
        <div className="inline-flex mr-1.5">
          {`${t("client-layout.framework-message")}`}
        </div>
        <Link
          href="https://nextjs.org"
          className="mt-1"
          target="_blank"
          rel="noopener"
        >
          <Image
            src={"/nextLogo.svg"}
            alt={`${t("client-layout.btn-framework-logo-alt")}`}
            width={64}
            height={64}
            className="mr-2 hover:underline"
          />
          <span
            className={`absolute bottom-full w-fit right-4 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >{`${t("client-layout.btn-framework-logo-tooltip")}`}</span>
        </Link>
      </div>
    </div>
  );
};

export default PageFooter;
