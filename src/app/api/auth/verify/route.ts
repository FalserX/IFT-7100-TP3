import { NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { signToken } from "../../../../libs/jwt";
import { getUserByAddress, createUserIfNotExist } from "../../../../libs/user";
import {
  ReadUsersResult,
  UserOwnerView,
  WriteUsersResult,
} from "../../../../types/user";
import { TokenAPIMessage } from "../../../../types/auth";
import { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  const { address, message, signature } = await request.json();
  try {
    const recoverAddress = verifyMessage(message, signature);
    if (recoverAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: "errors.auth.wallet.invalid" },
        { status: 401 }
      );
    }
    const user: WriteUsersResult = await createUserIfNotExist(address);
    if (!user.success) {
      return NextResponse.json(
        { error: user.error?.errorStatus },
        { status: user.error?.errorStatus }
      );
    }
    const userRead: ReadUsersResult = await getUserByAddress(address);
    if (!userRead.success) {
      return NextResponse.json(
        { error: userRead.error?.errorMessage },
        { status: userRead.error?.errorStatus }
      );
    }
    const userData: UserOwnerView = userRead.data as UserOwnerView;
    const token: TokenAPIMessage = await signToken(
      {
        id: userData.id,
        role: userData.role,
        address: userData.wallet,
        method: "web3",
      },
      process.env.APP_KEY || ""
    );
    if (!token.success) {
      return NextResponse.json(
        { error: token.error?.errorMessage },
        { status: token.error?.errorStatus }
      );
    }
    const tokenData: string | JwtPayload | undefined = token.data;
    const response = NextResponse.json(
      {
        message: "auth.access.connected",
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", tokenData as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 heure
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("Error in /api/auth/verify: ", err);
    return NextResponse.json({ error: "errors.auth.verify" }, { status: 500 });
  }
}
