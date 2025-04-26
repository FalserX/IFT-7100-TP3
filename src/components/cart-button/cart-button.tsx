import { useLocale } from "@/contexts/locale-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import React from "react";
import { useWallet } from "@/contexts/wallet-context";

type Props = {
  imgAlt: string;
  imgSrc: string;
  tooltip?: string;
};

const CartButton = ({ imgAlt, imgSrc, tooltip }: Props) => {
  const pathname = usePathname();
  const { currentLocale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useWallet();
  const isUserProfile = pathname.includes(`${currentLocale}/users/${address}`);
  const handleClick = () => {
    if (!isUserProfile) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "cart");
      router.replace(`${pathname}/users/${address}?${params.toString()}`, {
        scroll: false,
      });
    }
  };
  const { getLocaleString } = useLocale();
  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2  min-h-12 rounded-xl px-3 py-1 items-center  ${
        isUserProfile
          ? "hover:cursor-not-allowed border-gray-600 text-gray-500 "
          : "hover:cursor-pointer hover:underline hover:font-bold border-white text-white"
      }`}
    >
      <Image
        alt={imgAlt && getLocaleString(imgAlt)}
        src={imgSrc}
        className={`mr-3 ${
          !isUserProfile ? "filter brightness-200" : "filter brightness-50"
        }`}
        width={16}
        height={16}
      />
      {tooltip
        ? !isUserProfile && (
            <span
              className={`absolute top-full max-w-md left-0 break-words transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              {getLocaleString(tooltip)}
            </span>
          )
        : LoadingSpinner && <LoadingSpinner size={16} />}
      {getLocaleString("users.user.cart.title")}
    </div>
  );
};

export default CartButton;
