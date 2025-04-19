"use client";
import {
  getColorBorderPopupType,
  getColorButtonPopupType,
  getColorHeaderPopupType,
  getImageAltPopupType,
  getImagePopupType,
  PopupType,
} from "@/types/popup";
import { useLocale } from "@/contexts/locale-context";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
export type PopupDialogProps = {
  popupMessage?: string;
  popupTitle?: string;
  popupType: PopupType;
  popupActive?: boolean;
  popupAction?: () => void;
  popupCancelAction?: () => void;
};

const PopupDialog: React.FC<PopupDialogProps> = ({
  popupMessage,
  popupTitle,
  popupType = PopupType.INFO,
  popupActive,
  popupAction,
  popupCancelAction,
}: PopupDialogProps) => {
  const { getLocaleString } = useLocale();
  const [visible, setVisible] = useState<boolean>(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const hideDelayRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    if (popupActive) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      hideDelayRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }
    if (popupActive && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
    return () => {
      if (hideDelayRef.current) clearTimeout(hideDelayRef.current);
    };
  }, [popupActive]);

  if (!shouldRender) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 
        ${visible ? "bg-[rgba(0,0,0,0.5)]" : "bg-[rgba(0,0,0,0)]"}`}
    >
      <div
        className={`bg-transparent border-2 ${
          getColorBorderPopupType[popupType]
        } ${
          getColorHeaderPopupType[popupType]
        } rounded-t-xl rounded-b-lg shadow-lg max-w-md w-full text-white transform transition-all duration-300 
        ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div
          className={`flex rounded-t-xl flex-col justify-between items-cente w-full h-full ${getColorHeaderPopupType[popupType]}`}
        >
          <div
            className={`flex flex-col py-2 rounded-t-xl text-lg justify-center text-center font-bold w-full ${getColorHeaderPopupType[popupType]}`}
          >
            {getLocaleString(popupTitle ? popupTitle : "")}
          </div>
          <div
            className={`flex flex-col text-black rounded-b-xl ${getColorHeaderPopupType[popupType]} w-full`}
          >
            <div className="flex flex-row gap-2">
              <div className={`${getColorHeaderPopupType[popupType]} px-2`}>
                <Image
                  src={getImagePopupType[popupType]}
                  alt={getImageAltPopupType[popupType]}
                  className={"p-2"}
                  width={60}
                  height={60}
                />
              </div>
              <div
                className={
                  "min-h-[150px] overflow-scroll bg-white min-w-[22rem] border-2 rounded-lg border-white"
                }
              >
                <span className="ml-1">
                  {getLocaleString(popupMessage ? popupMessage : "")}
                </span>
              </div>
            </div>
            <div
              className={`flex justify-end gap-2 p-1 ${getColorHeaderPopupType[popupType]}`}
            >
              <button
                onClick={() => {
                  popupCancelAction?.();
                }}
                className={`px-4 py-2 bg-gray-400 rounded-lg hover:underline hover:font-bold`}
              >
                {getLocaleString("popup.cancel")}
              </button>
              <button
                ref={confirmBtnRef}
                onClick={() => {
                  popupAction?.();
                }}
                className={`px-4 py-2 ${getColorButtonPopupType[popupType]} text-white rounded-lg hover:underline hover:font-bold`}
              >
                {getLocaleString("popup.confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDialog;
