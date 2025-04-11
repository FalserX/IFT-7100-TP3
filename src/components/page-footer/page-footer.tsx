"use client";
import { getCurrentYear } from "@/utils/dates";
import Image from "next/image";
type PageFooterProps = {
  name: string;
  siteName: string;
  frontEndSrcImage: string;
  frontEndAltImage: string;
};

const PageFooter = ({
  name,
  siteName,
  frontEndAltImage,
  frontEndSrcImage,
}: PageFooterProps) => {
  return (
    <div className="bg-gray-700 inline-flex min-w-full rounded-2xl grow">
      <div className="m-2 inline-flex grow">
        &#169; {siteName}, {getCurrentYear()}
      </div>
      <div className="inline-flex grow justify-end">
        <div className="inline-flex mt-2 mr-1.5">{name}</div>
        <Image
          src={frontEndSrcImage}
          alt={frontEndAltImage}
          width={64}
          height={64}
          className="mr-2"
        />
      </div>
    </div>
  );
};

export default PageFooter;
