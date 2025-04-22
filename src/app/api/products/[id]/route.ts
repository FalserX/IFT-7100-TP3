import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  softDeleteProduct,
  getProductById,
} from "../../../../libs/product";
import { getTokenFromRequest } from "../../../../libs/jwt";
import { ProductType, ReadProductsResult } from "../../../../types/product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getTokenFromRequest(process.env.APP_KEY || "");
    if (!token.success) {
      return NextResponse.json(
        { error: token.error.errorMessage },
        { status: token.error.errorStatus }
      );
    }

    const { success, error, data }: ReadProductsResult = await getProductById(
      params.id,
      false
    );
    if (!success) {
      return NextResponse.json(
        { error: error?.errorMessage },
        { status: error?.errorStatus }
      );
    }
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (err) {
    throw new Error(`API Error: ${err}`);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updated = await updateProduct(params.id, tokenData.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updated = await updateProduct(params.id, tokenData.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getTokenFromRequest(process.env.APP_KEY || "");
    if (!token.success) {
      return NextResponse.json(
        { error: token.error.errorMessage },
        { status: token.error.errorStatus }
      );
    }
    const tokenData = token.data;
    await softDeleteProduct(params.id, tokenData.id);
    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
