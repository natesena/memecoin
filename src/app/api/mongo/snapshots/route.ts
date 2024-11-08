import { connectToDatabase } from "@/lib/db/client";
import HolderSnapshot from "@/lib/db/models/holderSnapshot";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const snapshots = await HolderSnapshot.aggregate([
      // Sort by scannedAt for each contract
      { $sort: { contract: 1, scannedAt: 1 } },
      // Group by contract
      {
        $group: {
          _id: "$contract",
          contract: { $first: "$contract" },
          ticker: { $first: "$ticker" },
          snapshots: {
            $push: {
              holders: "$holders",
              scannedAt: "$scannedAt",
            },
          },
        },
      },
      // Sort by ticker
      { $sort: { ticker: 1 } },
    ]);

    return NextResponse.json(snapshots);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch token snapshots" },
      { status: 500 }
    );
  }
}
