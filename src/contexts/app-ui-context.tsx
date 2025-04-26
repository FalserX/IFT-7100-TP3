"use client";
import { LoadingSpinnerProps } from "@/components/loading-spinner/loading-spinner";
import { PopupDialogProps } from "@/components/popup-dialog/popup-dialog";
import { ToastNotificationProps } from "@/components/toast-notifications/toast-notifications";
import { NotifType } from "@/types/notification";
import { PopupType } from "@/types/popup";
import React, { useContext, createContext, useState } from "react";

//#region Global

type AppUIContextType = {
  LoadingSpinner?: React.ComponentType<LoadingSpinnerProps>;
  ToastNotif?: React.ComponentType<ToastNotificationProps>;
  PopupDialog?: React.ComponentType<PopupDialogProps>;
  pageName: string;
  siteName: string;
  notifMessage?: string;
  notifType?: NotifType;
  notifActive?: boolean;
  notifDuration?: number;
  popupMessage?: string;
  popupTitle?: string;
  popupType?: PopupType;
  popupActive?: boolean | undefined;
  popupAction?: () => void;
  popupCancelAction?: () => void;

  setNotifDuration?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setNotifType?: React.Dispatch<React.SetStateAction<NotifType>>;
  setNotifMessage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPageName?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setNotifActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupMessage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPopupTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPopupType?: React.Dispatch<React.SetStateAction<PopupType>>;
  setPopupActive?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setPopupAction?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
  setPopupCancelAction?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
};

const AppUIContext = createContext<AppUIContextType | null>(null);

export const AppUIContextProvider = ({
  children,
  LoadingSpinner,
  siteName,
  ToastNotif,
  PopupDialog,
}: {
  children: React.ReactNode;
  LoadingSpinner?: React.ComponentType<LoadingSpinnerProps>;
  ToastNotif?: React.ComponentType<ToastNotificationProps>;
  PopupDialog?: React.ComponentType<PopupDialogProps>;

  pageName?: string;
  siteName: string;
  popupMessage?: string;
  popupTitle?: string;
  popupType?: PopupType;
  popupAction?: () => void;
  popupCancelAction?: () => void;

  setPageName?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setNotifMessage?: React.Dispatch<React.SetStateAction<string>>;
  setNotifDuration?: React.Dispatch<React.SetStateAction<number>>;
  setNotifType?: React.Dispatch<React.SetStateAction<NotifType>>;
  setNotifActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupMessage?: React.Dispatch<React.SetStateAction<string>>;
  setPopupTitle?: React.Dispatch<React.SetStateAction<string>>;
  setPopupType?: React.Dispatch<React.SetStateAction<PopupType>>;
  setPopupActive?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setPopupCancelAction?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
  setPopupAction?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
}) => {
  const [notifMessage, setNotifMessage] = useState<string | undefined>(
    undefined
  );
  const [pageName, setPageName] = useState<string | undefined>(undefined);
  const [popupActive, setPopupActive] = useState<boolean | undefined>(
    undefined
  );
  const [popupAction, setPopupAction] = useState<(() => void) | undefined>(
    undefined
  );
  const [popupCancelAction, setPopupCancelAction] = useState<
    (() => void) | undefined
  >(undefined);
  const [popupMessage, setPopupMessage] = useState<string | undefined>();
  const [popupType, setPopupType] = useState<PopupType>(PopupType.INFO);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();
  const [notifActive, setNotifActive] = useState<boolean>(false);
  const [notifDuration, setNotifDuration] = useState<number | undefined>();
  const [notifType, setNotifType] = useState<NotifType>(NotifType.INFO);

  return (
    <AppUIContext.Provider
      value={{
        setPopupCancelAction,
        popupCancelAction,
        LoadingSpinner,
        ToastNotif,
        PopupDialog,
        setPageName,
        pageName: pageName ?? "",
        siteName,
        notifDuration,
        notifMessage,
        notifActive,
        notifType,
        popupAction,
        popupActive,
        popupMessage,
        popupTitle,
        popupType,
        setPopupAction,
        setPopupActive,
        setPopupMessage,
        setPopupTitle,
        setPopupType,
        setNotifMessage,
        setNotifType,
        setNotifActive,
        setNotifDuration,
      }}
    >
      {children}
    </AppUIContext.Provider>
  );
};

export const useAppUI = () => {
  const context = useContext(AppUIContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingContextProvider");
  }
  return context;
};

//#endregion
