"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { login } from "../libs/auth";
import { UserOwnerView } from "@/types/user";
import { APIErrorMessage } from "@/types/auth";

type AuthContextType = {
  user: UserOwnerView | null;
  authenticated: boolean;
  loading: boolean;
  error?: APIErrorMessage | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserOwnerView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<APIErrorMessage | null>(null);

  const logout = async (): Promise<void> => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (res.ok) {
        await refreshUser();
      } else {
        const errorData = await res.json();
        console.error(`Error occured when logout user: ${errorData}`);
        setError({
          errorMessage: "errors.users.user.logout",
          errorStatus: 500,
        });
      }
    } catch (err) {
      console.error(err);
      setError({
        errorMessage: "errors.users.user.logout",
        errorStatus: 500,
        errorConsole: String(err),
      });
    }
  };
  const refreshUser = async () => {
    try {
      const res = await fetch(`/api/users/me`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (err) {
      setError({
        errorMessage: "errors.users.user.get",
        errorStatus: 500,
        errorConsole: String(!!err),
      });
    }
  };
  useEffect(() => {
    const autoLogin = async () => {
      if (typeof window == "undefined" || !window.ethereum) {
        setLoading(false);
        return;
      }
      if (localStorage.getItem("auth-in-progress")) {
        return;
      }
      localStorage.setItem("auth-in-progress", "true");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const token = await login();
          if (token) {
            await refreshUser();
          } else {
            setError({
              errorStatus: 500,
              errorMessage: "errors.login.success",
            });
          }
        }
      } catch (err) {
        setError({
          errorStatus: 500,
          errorMessage: "errors.login.success",
          errorConsole: String(err),
        });
      } finally {
        setLoading(false);
        localStorage.removeItem("auth-in-progress");
      }
    };
    autoLogin();
  }, [setAuthenticated, setError, setLoading]);

  return (
    <AuthContext.Provider
      value={{ user, authenticated, loading, error, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be use with <AuthProvider>");
  }
  return context;
};
