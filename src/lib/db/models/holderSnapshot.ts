import mongoose, { Document } from "mongoose";
import type { HolderSnapshot } from "@/types/HolderSnapshot";

export interface HolderSnapshotDocument extends HolderSnapshot, Document {}

const holderSnapshotSchema = new mongoose.Schema(
  {
    contract: { type: String, required: true },
    ticker: { type: String, required: true },
    name: { type: String, required: true },
    holders: { type: String, required: true },
    rank: { type: String, required: true },
    percentage: { type: String, required: true },
    chain: { type: String, required: true },
    scannedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const HolderSnapshotModel =
  mongoose.models.HolderSnapshot ||
  mongoose.model<HolderSnapshotDocument>(
    "HolderSnapshot",
    holderSnapshotSchema
  );

export default HolderSnapshotModel;
