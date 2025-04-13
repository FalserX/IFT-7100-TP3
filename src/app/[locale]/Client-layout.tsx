"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { WalletResponse } from "@/types/wallet-response";
import PageHeader from "@/components/page-header/page-header";
import BannerDescriptor, {
  BannerType,
} from "@/components/banner-descriptor/banner-descriptor";
import PageFooter from "@/components/page-footer/page-footer";
import { Metadata } from "next";

const ClientLayout = ({
  metadata,
  children,
}: {
  metadata: Metadata;
  children: React.ReactNode;
}) => {
  const siteName = useMemo<string>(
    () => (metadata?.title ? (metadata.title as string) : ""),
    [metadata]
  );
  const [pageName, setPageName] = useState<string>("");
  const pathname = usePathname();
  const [walletResponse, setWalletResponse] = useState<
    WalletResponse | undefined
  >(undefined);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>("");
  const [bannerType, setBannerType] = useState<BannerType>(BannerType.INFO);
  const [bannerDisplayed, setBannerDisplayed] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showBanner = (
    message: string,
    type: BannerType = BannerType.INFO,
    duration: number = 5000
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBannerMessage(message);
    setBannerType(type);
    setBannerDisplayed(true);
    setBannerVisible(true);
    timerRef.current = setTimeout(() => {
      setBannerVisible(false);
    }, duration);
  };

  const handleBannerClose = () => {
    setBannerVisible(false);
  };
  const params = useParams();
  const currentLocale = params?.locale ? (params.locale as string) : "fr";

  useEffect(() => {
    const formatPageName = (path: string): string => {
      if (path === `/${currentLocale}`) return "Accueil";
      return (
        path.replace(`/${currentLocale}`, "").charAt(0).toUpperCase() +
        path.slice(2)
      );
    };

    setPageName(formatPageName(pathname));
    if (bannerVisible) {
      showBanner(bannerMessage, bannerType);
    }
  }, [bannerMessage, bannerType, bannerVisible, pathname, currentLocale]);

  return (
    <>
      <PageHeader
        pageName={pageName}
        siteName={siteName}
        setError={setBannerMessage}
        setBannerType={setBannerType}
        setBannerActive={setBannerVisible}
        setWalletResponse={setWalletResponse}
        walletResponse={walletResponse}
      />
      {bannerDisplayed && (
        <BannerDescriptor
          message={bannerMessage}
          bannerType={bannerType}
          active={bannerVisible}
          onClose={handleBannerClose}
          onTransitionEnd={() => {
            if (!bannerVisible) {
              setBannerDisplayed(false);
            } else {
              setBannerDisplayed(true);
            }
          }}
        />
      )}
      {children}
      <PageFooter
        name="Conçu avec "
        frontEndAltImage="NextJS logo"
        frontEndSrcImage="/nextLogo.svg"
        siteName={siteName}
      />
    </>
  );
};

export default ClientLayout;
