import { connectToDatabase } from "@/lib/db/client";
import TokenMetrics from "@/lib/db/models/tokenMetrics";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ contract: string }> }
) {
  const { contract } = await context.params;

  try {
    await connectToDatabase();

    const tokenMetrics = await TokenMetrics.find({
      contract: contract as string,
    })
      .select({
        contract: 1,
        hhi: 1,
        medianHolder: 1,
        holderDistribution: 1,
        lastUpdated: 1,
        createdAt: 1,
        _id: 1,
      })
      .exec();

    if (!tokenMetrics || tokenMetrics.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(tokenMetrics);
  } catch (error) {
    console.error("Error fetching token metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch token metrics" },
      { status: 500 }
    );
  }
}
