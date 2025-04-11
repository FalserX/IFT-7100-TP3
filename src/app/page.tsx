"use client";
import BannerDescriptor, {
  BannerType,
} from "@/components/banner-descriptor/banner-descriptor";
import PageBody from "@/components/page-body/page-body";
import PageFooter from "@/components/page-footer/page-footer";
import PageHeader from "@/components/page-header/page-header";
import { WalletResponse } from "@/types/wallet-response";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const siteName = useMemo<string>(() => "NOM DU MAGASIN", []);
  const pageName = useMemo<string>(() => "ACCUEIL", []);
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

  useEffect(() => {
    if (bannerVisible) {
      showBanner(bannerMessage, bannerType);
    }
  }, [bannerMessage, bannerType, bannerVisible]);

  return (
    <>
      <main>
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
        <PageBody
          setError={setBannerMessage}
          setBannerType={setBannerType}
          setBannerActive={setBannerVisible}
          walletResponse={walletResponse}
        />
        <PageFooter
          name="Conçu avec "
          frontEndAltImage="NextJS logo"
          frontEndSrcImage="/nextLogo.svg"
          siteName={siteName}
        />
      </main>
    </>
  );
}
