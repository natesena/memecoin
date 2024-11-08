import { connectToDatabase } from "@/lib/db/client";
import TokenDetailsModel from "@/lib/db/models/tokenDetails";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ contract: string }> }
) {
  const { contract } = await context.params;

  try {
    await connectToDatabase();

    const tokenDetails = await TokenDetailsModel.findOne({
      contract,
    });

    if (!tokenDetails) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json(tokenDetails);
  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json(
      { error: "Failed to fetch token details" },
      { status: 500 }
    );
  }
}
