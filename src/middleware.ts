import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyToken } from "./libs/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { RoleType } from "./types/role";
import { APIErrorMessage } from "./types/auth";

const intlMiddleware = createMiddleware(routing);

interface UserAuthenticationResult {
  requester: string | JwtPayload | null;
  error?: APIErrorMessage;
}

export async function getAuthUser(
  request: NextRequest
): Promise<UserAuthenticationResult> {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return {
      requester: null,
      error: { errorMessage: "errors.access.connected", errorStatus: 400 },
    };
  }
  try {
    const requester = await verifyToken(token, process.env.APP_KEY || "");
    if (!requester.success) {
      return {
        requester: null,
        error: { errorMessage: "errors.access.forbidden", errorStatus: 401 },
      };
    }
    const requesterData = requester.data ?? null;
    return { requester: requesterData };
  } catch (err) {
    return {
      requester: null,
      error: {
        errorMessage: "errors.access.forbidden",
        errorStatus: 401,
        errorConsole: String(err),
      },
    };
  }
}

const accessControl = [
  {
    path: /^\/api\/users\/?$/,
    roles: [RoleType.ADMIN],
  },
  {
    path: /^\/api\/users\/([^/]+)$/,
    roles: [RoleType.ADMIN],
    allowOwner: true,
    resourceIdIndex: 1,
  },
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = intlMiddleware(request);

  const rule = accessControl.find(({ path }) => path.test(pathname));
  if (!rule) return response;

  const { requester, error } = await getAuthUser(request);

  if (
    !requester ||
    error ||
    typeof requester !== "object" ||
    !("role" in requester)
  ) {
    return NextResponse.json(
      { error: error?.errorMessage },
      { status: error?.errorStatus }
    );
  }
  const roles: RoleType[] = requester?.role;
  const hasRequiredRole = roles.some((role) => rule.roles.includes(role));

  const match = rule.path.exec(pathname);

  const resourceOwnerId =
    rule.resourceIdIndex !== undefined
      ? match?.[rule.resourceIdIndex]
      : undefined;

  const isOwner =
    rule.allowOwner && resourceOwnerId && requester?.id === resourceOwnerId;

  if (!hasRequiredRole && !isOwner) {
    return NextResponse.json(
      { error: "errors.access.forbidden" },
      { status: 403 }
    );
  }
  return response;
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*"],
};
