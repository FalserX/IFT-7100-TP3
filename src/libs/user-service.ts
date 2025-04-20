"use server";
import { TokenAPIMessage } from "@/types/auth";
import { getTokenFromRequest } from "./jwt";
import { cookies } from "next/headers";

export const updatePutUser = async (
  userId: string,
  originUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;

  const res = await fetch(`${originUrl}/api/users/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  else if (res.status !== 204) {
    return await res.json();
  }
};
export const updatePatchUser = async (
  userId: string,
  originUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;

  const res = await fetch(`${originUrl}/api/users/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  else if (res.status !== 204) {
    return await res.json();
  }
};

export const deleteUser = async (userId: string, originUrl: string) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  else if (res.status !== 204) {
    return await res.json();
  }
};

export const getCurrentUser = async (): Promise<TokenAPIMessage> => {
  try {
    const token = await getTokenFromRequest(process.env.APP_KEY || "");
    if (!token.success) {
      return { success: token.success, error: token.error };
    }
    return { success: token.success, data: token.data };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.error.users.user.get",
        errorConsole: String(err),
      },
    };
  }
};
