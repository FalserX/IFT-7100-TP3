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
const getImageBannerType = (bannerType: BannerType) => {
  switch (bannerType) {
    case BannerType.ERROR:
      return (
        <Image
          alt="icone du type de bannière"
          src="/Error.svg"
          width={64}
          height={64}
          className="pr-5"
        />
      );
    case BannerType.CONFIRM:
      return (
        <Image
          alt="icone du type de bannière"
          src="/Confirm.svg"
          width={64}
          height={64}
          className="pr-5"
        />
      );
    case BannerType.INFO:
      return (
        <Image
          alt="icone du type de bannière"
          src="/Info.svg"
          width={64}
          height={64}
          className="pr-5"
        />
      );
    case BannerType.WARNING:
      return (
        <Image
          alt="icone du type de bannière"
          src="/Warning.svg"
          width={64}
          height={64}
          className="pr-5"
        />
      );
    default:
      return "";
  }
};

const BannerDescriptor = ({
  message,
  bannerType = BannerType.INFO,
  active,
}: BannerDescriptorProps) => {
  if (active) {
    return (
      <div
        className={
          getBannerTypeColor(bannerType) +
          " text-white rounded-2xl inline-flex min-w-full p-5 text-center items-center"
        }
      >
        {getImageBannerType(bannerType)}
        {message}
      </div>
    );
  }
};

export default BannerDescriptor;
