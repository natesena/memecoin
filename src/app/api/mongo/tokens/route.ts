import { connectToDatabase } from "@/lib/db/client";
import HolderSnapshot from "@/lib/db/models/holderSnapshot";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = 50; // Fixed limit of 50 tokens per request

    await connectToDatabase();
    
    // First get the total count
    const [totalCount] = await HolderSnapshot.aggregate([
      {
        $group: {
          _id: "$contract"
        }
      },
      {
        $count: "total"
      }
    ]);

    // Then get the paginated tokens
    const uniqueTokens = await HolderSnapshot.aggregate([
      // Group by contract and get the first ticker
      {
        $group: {
          _id: "$contract",
          contract: { $first: "$contract" },
          ticker: { $first: "$ticker" },
          lastUpdated: { $max: "$timestamp" }
        },
      },
      // Sort by most recently updated
      { $sort: { lastUpdated: -1 } },
      // Add pagination
      { $skip: skip },
      { $limit: limit }
    ]);

    return NextResponse.json({
      tokens: uniqueTokens,
      hasMore: skip + limit < (totalCount?.total || 0),
      total: totalCount?.total || 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tokens: ${error}` },
      { status: 500 }
    );
  }
}
