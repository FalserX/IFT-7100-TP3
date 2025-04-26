"use client";
import {
  NotifType,
  getColorNotifType,
  getImageAltNotifType,
  getImageNotifType,
} from "@/types/notification";
import Image from "next/image";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/locale-context";

export type ToastNotificationProps = {
  notifMessage?: string;
  notifType?: NotifType;
  active?: boolean;
  duration?: number;
};
const ToastNotification: React.FC<ToastNotificationProps> = ({
  notifMessage,
  notifType = NotifType.INFO,
  active = false,
  duration = 5000,
}: ToastNotificationProps) => {
  const { getLocaleString } = useLocale();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideDelayRef = useRef<NodeJS.Timeout | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  const onHide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    if (!visible && shouldRender) {
      hideDelayRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }
  }, [visible, shouldRender]);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
    return () => {
      if (hideDelayRef.current) clearTimeout(hideDelayRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, duration]);
  if (!shouldRender) return null;
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl shadow-xl text-white px-4 py-3
        ${getColorNotifType[notifType]} transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
    >
      <Image
        src={getImageNotifType[notifType]}
        alt={getImageAltNotifType[notifType]}
        width={48}
        height={48}
        className="p-2"
      />
      <span className="text-xs">
        {notifMessage ? (
          getLocaleString(notifMessage)
        ) : (
          <LoadingSpinner size={16} />
        )}
      </span>
      <button
        onClick={onHide}
        aria-label="Fermer"
        className="ml-3 text-white hover:text-gray-300 transition"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastNotification;
