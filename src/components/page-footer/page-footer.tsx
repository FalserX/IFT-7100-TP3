"use client";
import { useAppUI } from "@/contexts/app-ui-context";
import { useLocale } from "@/contexts/locale-context";
import { getCurrentYear } from "@/libs/dates";
import Image from "next/image";
import Link from "next/link";

const PageFooter = () => {
  const { getLocaleString } = useLocale();
  const { siteName } = useAppUI();
  return (
    <div className="inline-flex min-w-full rounded-2xl grow">
      <div className="m-2 inline-flex grow">
        &#169; {siteName}, {getCurrentYear()}
      </div>
      <div className="inline-flex grow justify-end relative group mt-3">
        <div className="inline-flex mr-1.5">
          {getLocaleString("footer.framework.logo.btn.message")}
        </div>
        <Link
          href="https://nextjs.org"
          className="mt-1"
          target="_blank"
          rel="noopener"
        >
          <Image
            src={"/nextLogo.svg"}
            alt={getLocaleString("footer.framework.logo.btn.alt")}
            width={64}
            height={64}
            className="mr-2 hover:underline"
          />
          <span
            className={`absolute bottom-full w-fit right-4 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {getLocaleString("footer.framework.logo.btn.tooltip")}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PageFooter;
