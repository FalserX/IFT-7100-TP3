"use client";
import { usePathname } from "next/navigation";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";

type Translations = {
  [key: string]: string;
};
type LocaleContextType = {
  currentLocale: string;
  setCurrentLocale: React.Dispatch<SetStateAction<string>>;
  translations: Translations;
  getLocaleString: (key: string) => string;
  getSupportedLanguages: () => string[];
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const loadTranslations = async (locale: string): Promise<Translations> => {
  try {
    const response = await fetch(`/api/translations?locale=${locale}`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const LocaleContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const supportedLanguages = useMemo<string[]>(() => {
    return ["fr", "en"] as const;
  }, []);

  const [currentLocale, setCurrentLocale] = useState<string>("fr");
  const [translations, setTranslations] = useState<Translations>({});
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const getSupportedLanguages = (): string[] => {
    return supportedLanguages;
  };
  const getLocaleString = (key: string): string => {
    try {
      const keys: string[] = key.split(".");
      let result: Translations | string = translations;
      for (const k of keys) {
        if (typeof result === "object" && result !== null && k in result) {
          result = (result as Translations)[k];
        } else {
          return key;
        }
      }
      return typeof result === "string" ? result : key;
    } catch (err) {
      console.error(err);
      return "";
    }
  };
  const pathname = usePathname();

  useEffect(() => {
    const fetchTranslations = async () => {
      const loadedTranslations = await loadTranslations(currentLocale);
      setTranslations(loadedTranslations);
    };
    fetchTranslations();
  }, [currentLocale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const localeFromPath = pathname.split("/")[1];
    if (supportedLanguages.includes(localeFromPath)) {
      setCurrentLocale(localeFromPath);
    }
  }, [pathname, supportedLanguages]);
  if (!isMounted) {
    return;
  }
  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        setCurrentLocale,
        translations,
        getLocaleString,
        getSupportedLanguages,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be within CurrentLocaleProvider");
  }
  return context;
};
