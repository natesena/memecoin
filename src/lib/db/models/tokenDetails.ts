import mongoose, { Document, Model } from "mongoose";
import type { TokenDetails } from "@/types/TokenDetails";

export interface TokenDetailsDocument
  extends Document,
    Omit<TokenDetails, "_id"> {}

const tokenDetailsSchema = new mongoose.Schema(
  {
    contract: { type: String, required: true, unique: true },
    name: String,
    ticker: String,
    holders: String,
    holdersOver10: String,
    marketCap: String,
    marketCapPerHolder: String,
    marketCapPerHolderOver10: String,
    openTokenAccounts: String,
    holdersToOpenAccountsRatio: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const TokenDetailsModel: Model<TokenDetailsDocument> =
  mongoose.models.TokenDetails ||
  mongoose.model<TokenDetailsDocument>("TokenDetails", tokenDetailsSchema);

export default TokenDetailsModel;
