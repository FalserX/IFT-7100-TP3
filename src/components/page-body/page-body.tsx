"use client";
import { useState } from "react";
import BannerDescriptor, {
  BannerType,
} from "../banner-descriptor/banner-descriptor";

type PageBodyProps = {
  name: string;
};

const PageBody = ({ name }: PageBodyProps) => {
  const [bannerMessage, setBannerMessage] = useState<string>();
  const [bannerType, setBannerType] = useState<BannerType>(BannerType.INFO);
  return (
    <>
      <BannerDescriptor
        bannerType={bannerType}
        message={bannerMessage}
        active={!!bannerMessage}
      />
      <div className="bg-white min-h-screen rounded-2xl"></div>
    </>
  );
};

export default PageBody;
