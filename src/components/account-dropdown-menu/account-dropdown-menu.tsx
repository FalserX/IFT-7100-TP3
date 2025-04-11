"use client";

import React, { useState } from "react";
import Image from "next/image";

type AccountDropdownMenuProps = React.PropsWithChildren<{
  dropdownLabel: string;
}>;

type AccountDropdownItemButtonProps = {
  onClick: () => void;
  label: string;
  buttonIconSrc: string;
  buttonIconAlt: string;
};

type AccountDropdownMenuButtonProps = {
  onClick: () => void;
  onBlur: () => void;
  label: string;
};

const AccountDropdownMenuButton = ({
  label,
  onClick,
  onBlur,
}: AccountDropdownMenuButtonProps) => {
  return (
    <div className="flex flex-row border-2 rounded-xl p-2">
      <Image
        src="\User.svg"
        alt="Compte Usager"
        width={32}
        height={32}
        className="pr-5"
      />
      <button onClick={onClick} onBlur={onBlur}>
        {label}
      </button>
    </div>
  );
};

const AccountDropdownMenu = ({
  dropdownLabel,
  children,
}: AccountDropdownMenuProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  return (
    <>
      <AccountDropdownMenuButton
        label={dropdownLabel}
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
        onBlur={() => {
          setDropdownOpen(false);
        }}
      />
      {dropdownOpen && (
        <div className="absolute right-0 top-24 justify-center text-center border-2 mr-2 text-white shadow-lg min-w-96 min-h-12 rounded-xl border-black shadow-black bg-gray-700 z-50">
          {children ? children : <div></div>}
        </div>
      )}
    </>
  );
};

export const AccountDropdownItemButton = ({
  buttonIconAlt,
  buttonIconSrc,
  label,
  onClick,
}: AccountDropdownItemButtonProps) => {
  return (
    <div className="flex border-2 border-white min-w-fit min-h-12 rounded-xl">
      <Image
        src={buttonIconSrc}
        alt={buttonIconAlt}
        width={58}
        height={58}
        className="pl-5 pr-5"
      />
      <button onClick={onClick}>{label}</button>
    </div>
  );
};

export default AccountDropdownMenu;
