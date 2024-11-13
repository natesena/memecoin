import { connectToDatabase } from "@/lib/db/client";
import TokenDetailsModel from "@/lib/db/models/tokenDetails";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ contract: string }> }
) {
  const { contract } = await context.params;
  console.log("Contract:", contract);

  try {
    await connectToDatabase();

    const tokenDetails = await TokenDetailsModel.find({
      contract: contract as string,
    })
      .select({
        contract: 1,
        ticker: 1,
        name: 1,
        holders: 1,
        holdersOver10: 1,
        marketCap: 1,
        marketCapPerHolder: 1,
        marketCapPerHolderOver10: 1,
        openTokenAccounts: 1,
        holdersToOpenAccountsRatio: 1,
        lastUpdated: 1,
        createdAt: 1,
        _id: 1,
      })
      .exec();

    if (!tokenDetails || tokenDetails.length === 0) {
      return NextResponse.json(
        { error: "No history found for token" },
        { status: 200 }
      );
    }

    return NextResponse.json(tokenDetails);
  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching token details" },
      { status: 500 }
    );
  }
}
