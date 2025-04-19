import { NextResponse } from "next/server";
import { authorizeServerRequest } from "../../../libs/server-auth";
import { RoleType } from "../../../types/role";
import { readUsers } from "../../../libs/user";
import { AuthorizationResult } from "../../../types/auth";

export async function GET() {
  const { requester, errorResponse }: AuthorizationResult =
    await authorizeServerRequest({
      allowedRoles: [RoleType.ADMIN],
    });

  if (!requester || errorResponse) {
    return NextResponse.json(
      { error: errorResponse?.errorMessage },
      { status: errorResponse?.errorStatus ?? 403 }
    );
  }
  const usersData = await readUsers(true);
  return NextResponse.json({ data: usersData }, { status: 200 });
}
