import { connectToDatabase } from "@/lib/db/client";
import HolderSnapshot from "@/lib/db/models/holderSnapshot";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const uniqueTokens = await HolderSnapshot.aggregate([
      // Group by contract and get the first ticker
      {
        $group: {
          _id: "$contract",
          contract: { $first: "$contract" },
          ticker: { $first: "$ticker" },
        },
      },
      // Sort by ticker for convenience
      { $sort: { ticker: 1 } },
    ]);

    return NextResponse.json(uniqueTokens);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tokens: ${error}` },
      { status: 500 }
    );
  }
}
