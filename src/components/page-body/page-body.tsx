"use client";
import { SetStateAction, Dispatch } from "react";
import { BannerType } from "../banner-descriptor/banner-descriptor";
import { WalletResponse } from "@/types/wallet-response";

type PageBodyProps = {
  setError: Dispatch<SetStateAction<string>>;
  setBannerActive: Dispatch<SetStateAction<boolean>>;
  setBannerType: Dispatch<SetStateAction<BannerType>>;
  walletResponse: WalletResponse | undefined;
};

const PageBody = ({
  setError,
  setBannerActive,
  setBannerType,
  walletResponse,
}: PageBodyProps) => {
  return (
    <>
      <div className="bg-white min-h-screen rounded-2xl text-black">
        {JSON.stringify(walletResponse)}
      </div>
    </>
  );
};

export default PageBody;
