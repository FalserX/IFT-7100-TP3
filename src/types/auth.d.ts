import { RoleType } from "./role";
import jwt from "jsonwebtoken";

export type TokenAPIMessage = {
  success: boolean;
  data?: jwt.JwtPayload | string;
  error?: APIErrorMessage;
};

export type APIErrorMessage = {
  errorMessage: string;
  errorStatus: number;
  errorConsole?: string | null;
};

export type Token = {
  id: string;
  role: number;
  address: string;
};

export interface ServerAuthResult {
  requester: Requester | null;
  error?: APIErrorMessage;
}

export interface Requester {
  id: string;
  role: RoleType[];
}
export interface AuthorizationOptions {
  allowedRoles: RoleType[];
  resourceOwnerId?: string;
}

export interface AuthorizationResult {
  requester: Requester | null;
  errorResponse?: APIErrorMessage | null;
}
