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
  getPathForLocale: (pathname: string, newLocale: string) => string;
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
    return ["fr", "en"];
  }, []);
  const pathname = usePathname();
  const localeFromPath = pathname.split("/")[1];
  const validLocale = supportedLanguages.includes(localeFromPath)
    ? localeFromPath
    : "en";

  const [currentLocale, setCurrentLocale] = useState<string>(validLocale);
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    if (validLocale !== currentLocale) {
      setCurrentLocale(validLocale);
    }
  }, [validLocale, currentLocale]);

  useEffect(() => {
    loadTranslations(currentLocale).then(setTranslations);
  }, [currentLocale]);

  const getSupportedLanguages = () => supportedLanguages;

  const getPathForLocale = (pathname: string, newLocale: string): string => {
    const segments = pathname.split("/");
    if (supportedLanguages.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    return segments.join("/") || "/";
  };

  const getLocaleString = (key: string): string => {
    try {
      const keys = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = translations;
      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          return key;
        }
      }
      return typeof result === "string" ? result : key;
    } catch (err) {
      console.log(err);
      return key;
    }
  };

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        setCurrentLocale,
        translations,
        getLocaleString,
        getSupportedLanguages,
        getPathForLocale,
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
