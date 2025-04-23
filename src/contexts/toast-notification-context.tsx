"use client";
import ToastNotification from "@/components/toast-notifications/toast-notifications";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { NotifType } from "@/types/notification";

type ToastContextType = {
  showToast: (message: string, type?: NotifType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastNotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<NotifType>(NotifType.INFO);
  const [active, setActive] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(5000);

  const showToast = useCallback(
    (msg: string, notifType: NotifType = NotifType.INFO, duration = 5000) => {
      setMessage(msg);
      setType(notifType);
      setDuration(duration);
      setActive(true);
      setTimeout(() => setActive(false), duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastNotification
        notifMessage={message}
        notifType={type}
        active={active}
        duration={duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToastNotification must be used inside ToastNotificationProvider"
    );
  }
  return context;
};
