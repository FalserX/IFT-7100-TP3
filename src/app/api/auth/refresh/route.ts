import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserById } from "../../../../libs/user";
import { UserOwnerView } from "../../../../types/user";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "errors.auth.refresh.token.invalid" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_KEY || ""
    ) as jwt.JwtPayload;
    const userId = decoded.id as string;
    const user = await getUserById(userId, false);
    if (!user.success) {
      return NextResponse.json(
        { error: user.error?.errorMessage },
        { status: user.error?.errorStatus }
      );
    }

    const payload = {
      id: (user.data as UserOwnerView).id,
      role: (user.data as UserOwnerView).role,
      method: "web3",
      address: (user.data as UserOwnerView).wallet,
    };

    const newToken = jwt.sign(payload, process.env.APP_KEY || "", {
      expiresIn: "1h",
    });

    const res = NextResponse.json({ sucess: true });
    res.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: `errors.auth.token.invalid. ${err}` },
      { status: 401 }
    );
  }
}
