import { connectToDatabase } from "@/lib/db/client";
import HolderSnapshot from "@/lib/db/models/holderSnapshot";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const query = searchParams.get('query') || '';
    const limit = 50; // Fixed limit of 50 tokens per request

    await connectToDatabase();
    
    // Build the search pipeline
    const searchPipeline = query ? [
      {
        $match: {
          $or: [
            { ticker: { $regex: query, $options: 'i' } },
            { contract: { $regex: query, $options: 'i' } }
          ]
        }
      }
    ] : [];
    
    // First get the total count with search filter
    const [totalCount] = await HolderSnapshot.aggregate([
      ...searchPipeline,
      {
        $group: {
          _id: "$contract"
        }
      },
      {
        $count: "total"
      }
    ]);

    // Then get the paginated tokens with search filter
    const uniqueTokens = await HolderSnapshot.aggregate([
      ...searchPipeline,
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
