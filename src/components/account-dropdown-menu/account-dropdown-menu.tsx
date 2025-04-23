"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";

type AccountDropdownItemButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  label: string;
  buttonIconSrc: string;
  buttonIconAlt: string;
  tooltip?: string;
};

type AccountDropdownMenuButtonProps = {
  tooltip: string;
  disable?: boolean;
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
  const { getLocaleString } = useLocale();
  const { LoadingSpinner } = useAppUI();

  return (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } flex-row border-2 rounded-xl p-3 items-center hover:underline hover:font-bold`}
    >
      <Image
        src={srcImg}
        alt={getLocaleString(altImg)}
        width={32}
        height={32}
        className="pr-5"
      />
      <button onClick={onClick}>
        {labelImg
          ? getLocaleString(labelImg)
          : LoadingSpinner && <LoadingSpinner size={32} />}
      </button>
      {tooltip ? (
        <span
          className={`absolute top-full left-0 w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {getLocaleString(tooltip)}
        </span>
      ) : (
        LoadingSpinner && <LoadingSpinner size={32} />
      )}
    </div>
  );
};

const AccountDropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { LoadingSpinner } = useAppUI();
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
          {children ? children : LoadingSpinner && <LoadingSpinner size={32} />}
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
  disabled,
  onClick,
  href,
}: AccountDropdownItemButtonProps) => {
  const { getLocaleString } = useLocale();
  const { LoadingSpinner } = useAppUI();

  return href ? (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center ${
        (onClick || href) && !disabled
          ? "hover:font-bold hover:cursor-pointer hover:underline"
          : ""
      }`}
    >
      {disabled ? (
        <>
          <Image
            src={buttonIconSrc}
            alt={buttonIconAlt && getLocaleString(buttonIconAlt)}
            width={58}
            height={58}
            className="pl-5 pr-5"
          />
          {label
            ? label.includes("|")
              ? getLocaleString(label.split("|")[0]) + label.split("|")[1]
              : getLocaleString(label)
            : LoadingSpinner && <LoadingSpinner size={32} />}
          {tooltip ? (
            <span
              className={`absolute bottom-full left-0 w-fit transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              {getLocaleString(tooltip)}
            </span>
          ) : (
            LoadingSpinner && <LoadingSpinner size={32} />
          )}
        </>
      ) : (
        <Link href={href} className="inline-flex">
          <Image
            src={buttonIconSrc}
            alt={buttonIconAlt && getLocaleString(buttonIconAlt)}
            width={58}
            height={58}
            className="pl-5 pr-5"
          />
          {label
            ? label.includes("|")
              ? getLocaleString(label.split("|")[0]) + label.split("|")[1]
              : getLocaleString(label)
            : LoadingSpinner && <LoadingSpinner size={32} />}
          {tooltip ? (
            <span
              className={`absolute bottom-full left-0 w-fit transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              {getLocaleString(tooltip)}
            </span>
          ) : (
            LoadingSpinner && <LoadingSpinner size={32} />
          )}
        </Link>
      )}
    </div>
  ) : (
    <div
      className={`flex ${
        tooltip ? "relative group" : ""
      } border-2 border-white min-w-fit min-h-12 rounded-xl items-center ${
        (onClick || href) && !disabled
          ? "hover:font-bold hover:cursor-pointer hover:underline"
          : ""
      }`}
    >
      <Image
        src={buttonIconSrc}
        alt={buttonIconAlt && getLocaleString(buttonIconAlt)}
        width={58}
        height={58}
        className="pl-5 pr-5"
      />
      <button onClick={onClick}>
        {label
          ? label.includes("|")
            ? getLocaleString(label.split("|")[0]) + label.split("|")[1]
            : getLocaleString(label)
          : LoadingSpinner && <LoadingSpinner size={32} />}
        {tooltip ? (
          <span
            className={`absolute bottom-full left-2 w-fit transform -translate-x-4 translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {getLocaleString(tooltip)}
          </span>
        ) : (
          LoadingSpinner && <LoadingSpinner size={32} />
        )}
      </button>
    </div>
  );
};

export default AccountDropdownMenu;
