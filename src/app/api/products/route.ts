import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "../../../types/product";
import { createProduct, readProducts } from "../../../libs/product";
import { getTokenFromRequest } from "../../../libs/jwt";
import { RoleType } from "../../../types/role";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  try {
    const token = await getTokenFromRequest(process.env.APP_KEY || "");
    if (!token.success) {
      return NextResponse.json(
        { error: token.error.errorMessage },
        { status: token.error.errorStatus }
      );
    }
    const tokenData = token.data;
    const userId = searchParams.get("userId") ?? null;
    if (userId) {
      const data = await readProducts(
        userId,
        tokenData.role === RoleType.ADMIN || tokenData.role === RoleType.VENDOR
      );
      return NextResponse.json({ data: data });
    } else {
      const data = await readProducts(undefined, false);
      return NextResponse.json({ data: data });
    }
  } catch (err) {
    throw new Error(`API Error : ${err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getTokenFromRequest(process.env.APP_KEY || "");
    if (!token.success) {
      return NextResponse.json(
        { error: token.error.errorMessage },
        { status: token.error.errorStatus }
      );
    }
    const tokenData = token.data;
    const data: ProductType | null = await req.json();
    if (!data) {
      throw new Error(`No data`);
    }
    const newProduct = await createProduct(tokenData.id, data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    throw new Error(`API Error : ${err}`);
  }
}
