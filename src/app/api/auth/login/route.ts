import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  const { address } = await request.json();

  const message = `Connexion à Fruits inc. pour l'adresse: ${address}\nNonce: ${uuid()}`;

  return NextResponse.json({ message });
}
