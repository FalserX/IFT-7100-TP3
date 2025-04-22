"use server";

import { cookies } from "next/headers";
import { ProductType } from "../types/product";

export const updatePutProduct = async (
  productId: string,
  originUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/products/${productId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return;
};
export const updatePatchProduct = async (
  productId: string,
  originUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/products/${productId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return;
};

export const deleteProduct = async (productId: string, originUrl: string) => {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return;
};

export const createProduct = async (
  originUrl: string,
  productData: ProductType | null
) => {
  if (!productData) {
    return;
  }
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/products`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error(`API Error. ${res.status}`);
  return;
};

export const readProduct = async (originUrl: string, productId: string) => {
  if (!productId) {
    return;
  }
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_token")?.value;
  const res = await fetch(`${originUrl}/api/products/${productId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error. ${res.status}`);
  return res.json;
};
