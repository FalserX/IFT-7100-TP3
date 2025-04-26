"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useRef } from "react";

type NavigationGuardContextType = {
  setShouldBlockNavigation: (shouldBlock: boolean) => void;
};

const NavigationGuardContext = createContext<
  NavigationGuardContextType | undefined
>(undefined);

export const NavigationGuardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const nextPathRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (shouldBlockNavigation) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldBlockNavigation]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        const path = url.pathname;

        if (shouldBlockNavigation && path !== pathname) {
          e.preventDefault();
          nextPathRef.current = path;
          setModalVisible(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [shouldBlockNavigation, pathname]);

  const confirmNavigation = () => {
    if (nextPathRef.current) {
      const path = nextPathRef.current;
      nextPathRef.current = null;
      setShouldBlockNavigation(false); // reset pour ne pas rebloquer
      router.push(path);
    }
    setModalVisible(false);
  };

  const cancelNavigation = () => {
    nextPathRef.current = null;
    setModalVisible(false);
  };

  return (
    <NavigationGuardContext.Provider value={{ setShouldBlockNavigation }}>
      {children}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">
              Quitter sans sauvegarder ?
            </h2>
            <p className="mb-4">
              Des modifications non sauvegardées seront perdues.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelNavigation}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmNavigation}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </NavigationGuardContext.Provider>
  );
};

export const useNavigationGuard = () => {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx)
    throw new Error(
      "useNavigationGuard must be used in NavigationGuardProvider"
    );
  return ctx;
};
