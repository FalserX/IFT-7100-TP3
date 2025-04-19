import { getUserById } from "../../../../libs/user";
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "../../../../libs/jwt";

export async function GET(request: NextRequest) {
  const token = await getTokenFromRequest(request, process.env.APP_KEY || "");
  if (!token.success) {
    return NextResponse.json(
      { error: token.error.errorMessage },
      { status: token.error.errorStatus }
    );
  }
  const tokenData = token.data;

  const user = await getUserById(tokenData.id, false);

  if (!user.success) {
    return NextResponse.json(
      { error: user.error?.errorMessage },
      { status: user.error?.errorStatus }
    );
  }
  return NextResponse.json({ data: user.data }, { status: 200 });
}
