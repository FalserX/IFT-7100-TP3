import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import {
  AuthorizationOptions,
  AuthorizationResult,
  ServerAuthResult,
  TokenAPIMessage,
} from "../types/auth";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function authorizeServerRequest(
  options: AuthorizationOptions
): Promise<AuthorizationResult> {
  const { requester, error } = await getServerAuthUser();

  if (!requester || error) {
    return {
      requester: null,
      errorResponse: {
        errorStatus: error?.errorStatus ?? 403,
        errorMessage: error?.errorMessage ?? "errors.access.forbidden",
      },
    };
  }
  const hasRequiredRole =
    options.allowedRoles?.some((role) => requester.role.includes(role)) ??
    false;

  const isOwner =
    options.resourceOwnerId && options.resourceOwnerId === requester.id;

  if (!hasRequiredRole && !isOwner) {
    return {
      requester: null,
      errorResponse: {
        errorStatus: 403,
        errorMessage: "errors.access.forbidden",
      },
    };
  }

  return { requester: requester };
}

export async function getTokenFromRequest(
  request: NextRequest,
  SECRET: jwt.Secret
): Promise<TokenAPIMessage> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;
    if (!token) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.jwt.secret.token.found",
        },
      };
    }
    const decoded: TokenAPIMessage = await verifyToken(token, SECRET);
    if (!decoded.success) {
      return { success: decoded.success, error: decoded.error };
    }
    const decodedData: jwt.JwtPayload | string = decoded.data as
      | jwt.JwtPayload
      | string;
    return { success: true, data: decodedData };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.jwt.secret.token.",
        errorConsole: String(err),
      },
    };
  }
}

export async function getServerAuthUser(): Promise<ServerAuthResult> {
  const token = (await cookies()).get("auth_token")?.value;
  const SECRET = process.env.APP_KEY || "";
  if (!token) {
    return {
      requester: null,
      error: {
        errorMessage: "errors.access.connected",
        errorStatus: 401,
      },
    };
  }

  try {
    const decoded = await verifyToken(token, SECRET);
    if (!decoded.success) {
      return {
        requester: null,
        error: {
          errorMessage: decoded.error?.errorMessage ?? "Unknown error",
          errorStatus: decoded.error?.errorStatus ?? 500,
        },
      };
    }
    const decodedData = decoded.data;
    if (
      decodedData &&
      typeof decodedData === "object" &&
      "id" in decodedData &&
      "role" in decodedData
    ) {
      return {
        requester: {
          id: decodedData.id,
          role: decodedData.role,
        },
      };
    } else {
      return {
        requester: null,
        error: {
          errorMessage: "errors.access.forbidden",
          errorStatus: 403,
        },
      };
    }
  } catch (err) {
    return {
      requester: null,
      error: {
        errorMessage: "errors.access.forbidden",
        errorStatus: 403,
        errorConsole: String(err),
      },
    };
  }
}
