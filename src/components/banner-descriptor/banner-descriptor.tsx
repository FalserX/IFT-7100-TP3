import { useTranslations } from "next-intl";
import Image from "next/image";

export enum BannerType {
  ERROR = 0,
  INFO = 1,
  WARNING = 2,
  CONFIRM = 3,
}

type BannerDescriptorProps = {
  bannerType: BannerType;
  message?: string;
  active?: boolean;
  onTransitionEnd: () => void;
  onClose?: () => void;
};

const getBannerTypeColor = (bannerType: BannerType) => {
  switch (bannerType) {
    case BannerType.ERROR:
      return "bg-red-700";
    case BannerType.CONFIRM:
      return "bg-green-700";
    case BannerType.INFO:
      return "bg-blue-700";
    case BannerType.WARNING:
      return "bg-amber-700";
    default:
      return "bg-white-700";
  }
};
const getImageBannerType = (bannerType: BannerType, bannerImgAlt: string) => {
  const srcMap: Record<BannerType, string> = {
    [BannerType.CONFIRM]: "/Confirm.svg",
    [BannerType.ERROR]: "/Error.svg",
    [BannerType.INFO]: "/Info.svg",
    [BannerType.WARNING]: "Warning.svg",
  };
  return (
    <Image
      alt={bannerImgAlt}
      src={srcMap[bannerType]}
      width={48}
      height={48}
      className="p-2"
    />
  );
};

const BannerDescriptor = ({
  message,
  bannerType = BannerType.INFO,
  active = false,
  onTransitionEnd,
  onClose,
}: BannerDescriptorProps) => {
  const t = useTranslations();
  const bannerTypeImgAltTranslate: Record<BannerType, string> = {
    [BannerType.CONFIRM]: "banner.btn-confirm-alt",
    [BannerType.ERROR]: "banner.btn-error-alt",
    [BannerType.INFO]: "banner.btn-info-alt",
    [BannerType.WARNING]: "banner.btn-warning-alt",
  };
  return (
    <div
      onTransitionEnd={onTransitionEnd}
      className={`
        fixed bottom-5 right-5 z-50
        flex items-center gap-2 rounded-2xl shadow-xl text-white px-4 py-3
        ${getBannerTypeColor(bannerType)}
        transition-all duration-300 ease-in-out
        ${
          active
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-4 invisible"
        }
        `}
    >
      {getImageBannerType(
        bannerType,
        `${t(`${bannerTypeImgAltTranslate[bannerType]}`)}`
      )}
      <span className="text-sm">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-300 transition"
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
    </div>
  );
};
export default BannerDescriptor;
