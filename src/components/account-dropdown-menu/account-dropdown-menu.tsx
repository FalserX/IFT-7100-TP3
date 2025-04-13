"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "use-intl";

type AccountDropdownMenuProps = React.PropsWithChildren<{
  dropdownLabel?: string;
}>;

type AccountDropdownItemButtonProps = {
  onClick?: () => void;
  href?: string;
  label: string;
  buttonIconSrc: string;
  buttonIconAlt: string;
  tooltip?: string;
};

type AccountDropdownMenuButtonProps = {
  tooltip: string;
  srcImg: string;
  altImg: string;
  labelImg: string;
  onClick: () => void;
};

const AccountDropdownMenuButton = ({
  onClick,
  tooltip,
  labelImg,
  srcImg,
  altImg,
}: AccountDropdownMenuButtonProps) => {
  return (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } flex-row border-2 rounded-xl p-2 items-center`}
    >
      <Image
        src={srcImg}
        alt={altImg}
        width={32}
        height={32}
        className="pr-5"
      />
      <button onClick={onClick}>{labelImg}</button>
      {tooltip ? (
        <span
          className={`absolute top-full left-1/2 transform -translate-x-1/2 translate-y-4 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {tooltip}
        </span>
      ) : (
        <></>
      )}
    </div>
  );
};

const AccountDropdownMenu = ({ children }: AccountDropdownMenuProps) => {
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
  const t = useTranslations();
  return (
    <div ref={menuRef}>
      <AccountDropdownMenuButton
        labelImg={`${t("account-dropdown.btn-label")}`}
        altImg={`${t("account-dropdown.btn-alt")}`}
        srcImg="\User.svg"
        tooltip={`${t("account-dropdown.btn-tooltip")}`}
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
  buttonIconSrc,
  label,
  tooltip,
  onClick,
  href,
}: AccountDropdownItemButtonProps) => {
  return href ? (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center`}
    >
      <Link href={href} className="inline-flex">
        <Image
          src={buttonIconSrc}
          alt={buttonIconAlt}
          width={58}
          height={58}
          className="pl-5 pr-5"
        />
        {label}
        {tooltip && (
          <span
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-4 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {tooltip}
          </span>
        )}
      </Link>
    </div>
  ) : (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center`}
    >
      <Image
        src={buttonIconSrc}
        alt={buttonIconAlt}
        width={58}
        height={58}
        className="pl-5 pr-5"
      />
      <button onClick={onClick}>
        {label}
        {tooltip && (
          <span
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-4 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {tooltip}
          </span>
        )}
      </button>
    </div>
  );
};

export default AccountDropdownMenu;
