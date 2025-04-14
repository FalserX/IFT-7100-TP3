"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import renderTranslate from "@/utils/renderTranslate";
import Loading from "../loading/loading";

type AccountDropdownMenuProps = React.PropsWithChildren<{
  currentLocale: string;
}>;

type AccountDropdownItemButtonProps = {
  onClick?: () => void;
  currentLocale: string;
  href?: string;
  label: string;
  buttonIconSrc: string;
  buttonIconAlt: string;
  tooltip?: string;
  loadingFallback?: React.ReactNode;
};

type AccountDropdownMenuButtonProps = {
  tooltip: string;
  currentLocale: string;
  srcImg: string;
  altImg: string;
  labelImg: string;
  onClick: () => void;
  loadingFallback?: React.ReactNode;
};

const AccountDropdownMenuButton = ({
  onClick,
  currentLocale,
  tooltip,
  labelImg,
  srcImg,
  altImg,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: AccountDropdownMenuButtonProps) => {
  const [altImage, setAltImage] = useState<string>("");
  const [labelImage, setLabelImage] = useState<string>("");
  const [tooltipT, setTooltipT] = useState<string>("");

  useEffect(() => {
    const getFetchTranslations = async (key: string, locale: string) => {
      return await renderTranslate(key, locale);
    };
    getFetchTranslations(altImg, currentLocale).then((res) => {
      setAltImage(res);
    });
    getFetchTranslations(labelImg, currentLocale).then((res) => {
      setLabelImage(res);
    });
    getFetchTranslations(tooltip, currentLocale).then((res) => {
      setTooltipT(res);
    });
  }, [currentLocale, altImg, labelImg, tooltip]);

  return (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } flex-row border-2 rounded-xl p-3 items-center hover:underline hover:font-bold`}
    >
      <Image
        src={srcImg}
        alt={altImage && altImage}
        width={32}
        height={32}
        className="pr-5"
      />
      <button onClick={onClick}>
        {labelImage ? labelImage : loadingFallback}
      </button>
      {tooltip ? (
        <span
          className={`absolute top-full left-0 w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {tooltipT}
        </span>
      ) : (
        loadingFallback
      )}
    </div>
  );
};

const AccountDropdownMenu = ({
  children,
  currentLocale,
}: AccountDropdownMenuProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={menuRef}>
      <AccountDropdownMenuButton
        currentLocale={currentLocale}
        labelImg={`account-dropdown.btn-label`}
        altImg={`account-dropdown.btn-alt`}
        srcImg="\User.svg"
        tooltip={`account-dropdown.btn-tooltip`}
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
      />
      {dropdownOpen && (
        <div className="absolute right-0 top-24 justify-center text-center border-2 mr-2 text-white shadow-lg min-w-96 min-h-12 rounded-xl border-black shadow-black bg-gray-700 z-50">
          {children ? children : <div></div>}
        </div>
      )}
    </div>
  );
};

export const AccountDropdownItemButton = ({
  buttonIconAlt,
  currentLocale,
  buttonIconSrc,
  label,
  tooltip,
  onClick,
  href,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: AccountDropdownItemButtonProps) => {
  const [btnIconAlt, setBtnIconAlt] = useState<string>("");
  const [btnLabel, setBtnLabel] = useState<string | React.ReactNode>(
    loadingFallback
  );
  const [btnTooltip, setBtnTooltip] = useState<string>("");

  useEffect(() => {
    const getFetchTranslations = async (key: string, locale: string) => {
      return renderTranslate(key, locale);
    };
    getFetchTranslations(buttonIconAlt, currentLocale).then((res) => {
      setBtnIconAlt(res);
    });
    getFetchTranslations(label, currentLocale).then((res) => {
      setBtnLabel(res);
    });
    if (tooltip) {
      getFetchTranslations(tooltip, currentLocale).then((res) =>
        setBtnTooltip(res)
      );
    }
  }, [currentLocale, buttonIconAlt, label, tooltip]);
  return href ? (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center ${
        onClick || href ? "hover:font-bold hover:underline" : ""
      }`}
    >
      <Link href={href} className="inline-flex">
        <Image
          src={buttonIconSrc}
          alt={btnIconAlt && btnIconAlt}
          width={58}
          height={58}
          className="pl-5 pr-5"
        />
        {btnLabel}
        {tooltip ? (
          <span
            className={`absolute bottom-full left-0 w-fit transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {btnTooltip}
          </span>
        ) : (
          <></>
        )}
      </Link>
    </div>
  ) : (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center ${
        onClick || href ? "hover:font-bold hover:underline" : ""
      }`}
    >
      <Image
        src={buttonIconSrc}
        alt={btnIconAlt && btnIconAlt}
        width={58}
        height={58}
        className="pl-5 pr-5"
      />
      <button onClick={onClick}>
        {btnLabel}
        {tooltip ? (
          <span
            className={`absolute bottom-full left-2 w-fit transform -translate-x-4 translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {btnTooltip}
          </span>
        ) : (
          <></>
        )}
      </button>
    </div>
  );
};

export default AccountDropdownMenu;
