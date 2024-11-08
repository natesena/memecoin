import { connectToDatabase } from "@/lib/db/client";
import HolderSnapshot from "@/lib/db/models/holderSnapshot";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ contract: string }> }
) {
  const { contract } = await context.params;

  try {
    await connectToDatabase();

    const snapshots = await HolderSnapshot.find(
      { contract },
      {
        contract: 1,
        ticker: 1,
        holders: 1,
        scannedAt: 1,
        _id: 1,
      }
    ).sort({ scannedAt: 1 });

    if (!snapshots || snapshots.length === 0) {
      return NextResponse.json(
        { error: "No history found for token" },
        { status: 404 }
      );
    }

    return NextResponse.json(snapshots);
  } catch (error) {
    console.error("Error fetching token history:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching token history" },
      { status: 500 }
    );
  }
}
