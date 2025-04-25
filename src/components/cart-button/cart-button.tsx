import { useLocale } from "@/contexts/locale-context";
import { usePathname } from "next/navigation";
import { useWallet } from "@/contexts/wallet-context";
import Image from "next/image";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import Link from "next/link";

type Props = {
  imgAlt: string;
  imgSrc: string;
  tooltip?: string;
};

const CartButton = ({ imgAlt, imgSrc, tooltip }: Props) => {
  const { currentLocale, getLocaleString, getPathForLocale } = useLocale();
  const pathname = usePathname();
  const { address } = useWallet();
  const isUserPage = pathname.includes(`/users/${address}`);
  const cartURL = isUserPage
    ? `${getPathForLocale(pathname, currentLocale)}?tab=cart`
    : `${getPathForLocale(pathname, currentLocale)}/users/${address}?tab=cart`;
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

      <Link href={`${cartURL}`} key={currentLocale}>
        {getLocaleString("users.user.cart.title")}
      </Link>
    </div>
  );
};

export default CartButton;
