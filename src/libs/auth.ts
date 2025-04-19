import { Eip1193Provider, ethers } from "ethers";
import { RoleType } from "../types/role";
import { NextRequest } from "next/server";
import { getAuthUser } from "../middleware";
import { AuthorizationOptions, AuthorizationResult } from "../types/auth";

declare global {
  interface Window {
    ethereum?: Eip1193Provider | undefined;
  }
}

export async function authorizeRequest(
  request: NextRequest,
  options: AuthorizationOptions
): Promise<AuthorizationResult> {
  const { allowedRoles, resourceOwnerId } = options;
  const { requester, error } = await getAuthUser(request);

  if (
    error ||
    !requester ||
    typeof requester !== "object" ||
    !("role" in requester)
  ) {
    return {
      requester: null,
      errorResponse: {
        errorMessage: error?.errorMessage ?? "Unknown error",
        errorStatus: error?.errorStatus ?? 500,
      },
    };
  }
  const roles: RoleType[] = requester.role as RoleType[];
  const hasAccess = roles.some((role) => allowedRoles.includes(role));

  const isOwner = resourceOwnerId && requester.id === resourceOwnerId;

  if (isOwner) {
    return {
      requester: { id: requester.id, role: requester.role },
      errorResponse: null,
    };
  }
  if (!hasAccess) {
    return {
      requester: null,
      errorResponse: {
        errorMessage: "errors.access.forbidden",
        errorStatus: 403,
      },
    };
  }

  return {
    requester: { id: requester.id, role: requester.role },
    errorResponse: null,
  };
}

export async function login() {
  if (typeof window == "undefined" || !window.ethereum) {
    return;
  }
  if (document.cookie.includes("auth_token")) {
    return;
  }
  if (localStorage.getItem("session-logout")) {
    localStorage.removeItem("session-logout");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: provider,
      signer: signer,
      address: address,
    }),
  });

  const { message } = await res.json();
  const signature = await signer.signMessage(message);
  const authRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, message, signature }),
  });

  const data = await authRes.json();
  return data.token;
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "GET",
  });

  localStorage.setItem("session-logout", "true");
}
