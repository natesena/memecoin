import { connectToDatabase } from "@/lib/db/client";
import { Token } from "@/lib/db/models/token";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const tokens = await Token.find({});
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
