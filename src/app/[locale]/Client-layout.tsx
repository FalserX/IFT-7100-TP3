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
import { useTranslations } from "next-intl";

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
  const [isClient, setIsClient] = useState<boolean>(true);
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
  const t = useTranslations();
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
    setIsClient(true);
    const extractPageKey = (path: string): string => {
      const trimmed = path.replace(`/${currentLocale}`, "").replace(/^\/+/, "");
      if (trimmed === "") {
        return "client-layout.Home.title";
      }

      const parts = trimmed.split("/");
      const pageKey = `client-layout.${parts.join(".")}.title`;
      return pageKey;
    };
    const pageKey = extractPageKey(pathname);
    setPageName(t(pageKey));
    if (bannerVisible) {
      showBanner(bannerMessage, bannerType);
    }
  }, [
    pathname,
    currentLocale,
    t,
    bannerMessage,
    bannerType,
    bannerVisible,
    setIsClient,
  ]);

  if (!isClient) return null;
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

      <PageFooter siteName={siteName} />
    </>
  );
};

export default ClientLayout;
