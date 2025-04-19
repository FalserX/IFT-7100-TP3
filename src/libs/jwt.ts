"use server";
import { TokenAPIMessage } from "@/types/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function signToken(
  payload: object,
  SECRET: jwt.Secret,
  expiresin: string = "1h"
): Promise<TokenAPIMessage> {
  if (!SECRET || SECRET === "") {
    return {
      success: false,
      error: { errorStatus: 500, errorMessage: "errors.jwt.secret.found" },
    };
  }
  let jwt_result: string = "";
  try {
    jwt_result = jwt.sign(payload, SECRET, {
      expiresIn: expiresin as jwt.SignOptions["expiresIn"],
    });
    if (!jwt_result.isWellFormed() || jwt_result.length === 0) {
      return {
        success: false,
        error: { errorStatus: 500, errorMessage: "errors.jwt.secret.empty" },
      };
    }
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.jwt.secret.sign",
        errorConsole: String(err),
      },
    };
  }
  return { success: true, data: jwt_result };
}

export async function verifyToken(
  token: string,
  SECRET: jwt.Secret
): Promise<TokenAPIMessage> {
  if (!SECRET || SECRET === "") {
    return {
      success: false,
      error: { errorStatus: 500, errorMessage: "errors.jwt.secret.found" },
    };
  }
  try {
    if (!token || token.split(".").length !== 3) {
      return {
        success: false,
        error: {
          errorStatus: 500,
          errorMessage: "errors.jwt.secret.malformed",
        },
      };
    }
    const decoded: jwt.JwtPayload | string = jwt.verify(token, SECRET);
    if (!decoded || (typeof decoded === "string" && decoded.length === 0)) {
      return {
        success: false,
        error: { errorStatus: 500, errorMessage: "errors.jwt.secret.match" },
      };
    }
    return { success: true, data: decoded };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.jwt.secret.verify",
        errorConsole: String(err),
      },
    };
  }
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
