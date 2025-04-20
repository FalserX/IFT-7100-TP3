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
  const { locale } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    const notFoundURL = request.nextUrl.clone();
    notFoundURL.pathname = `/${locale}/unauthorized`;
    NextResponse.redirect(notFoundURL);
    return {
      requester: null,
      error: { errorMessage: "errors.access.forbidden", errorStatus: 401 },
    };
  }
  try {
    const requester = await verifyToken(token, process.env.APP_KEY || "");
    if (!requester.success) {
      const notFoundURL = request.nextUrl.clone();
      notFoundURL.pathname = `/${locale}/unauthorized`;
      NextResponse.redirect(notFoundURL);
      return {
        requester: null,
        error: { errorMessage: "errors.access.forbidden", errorStatus: 401 },
      };
    }
    const requesterData = requester.data ?? null;
    return { requester: requesterData };
  } catch (err) {
    const notFoundURL = request.nextUrl.clone();
    notFoundURL.pathname = `/${locale}/unauthorized`;
    NextResponse.redirect(notFoundURL);
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
  {
    path: /^\/app\/users\/([^/]+)$/,
    roles: [RoleType.ADMIN],
    allowOwner: true,
    resourceIdIndex: 2,
  },
];

export async function middleware(request: NextRequest) {
  const { pathname, locale } = request.nextUrl;
  const response = intlMiddleware(request);

  const publicPaths = [
    "/login",
    "/api",
    "/_next",
    "/favicon.ico",
    "/en",
    "/fr",
    "/",
  ];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  const rule = accessControl.find(({ path }) => path.test(pathname));
  if (!rule) {
    const notFoundURL = request.nextUrl.clone();
    notFoundURL.pathname = `/${locale}/notFound`;
    return NextResponse.redirect(notFoundURL);
  }

  const { requester, error } = await getAuthUser(request);

  if (
    !requester ||
    error ||
    typeof requester !== "object" ||
    !("role" in requester)
  ) {
    const unauthorizedURL = request.nextUrl.clone();
    unauthorizedURL.pathname = `/${locale}/unauthorized`;
    return NextResponse.redirect(unauthorizedURL);
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
    const unauthorizedURL = request.nextUrl.clone();
    unauthorizedURL.pathname = `/${locale}/unauthorized`;
    return NextResponse.redirect(unauthorizedURL);
  }
  return response;
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*"],
};
