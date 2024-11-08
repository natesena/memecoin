import mongoose, { Document } from "mongoose";

export interface TokenDetailsDocument extends Document {
  contract: string;
  name?: string;
  ticker?: string;
  holders?: string;
  holdersOver10?: string;
  marketCap?: string;
  marketCapPerHolder?: string;
  marketCapPerHolderOver10?: string;
  openTokenAccounts?: string;
  holdersToOpenAccountsRatio?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

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

const TokenDetailsModel =
  mongoose.models.TokenDetails ||
  mongoose.model<TokenDetailsDocument>("TokenDetails", tokenDetailsSchema);

export default TokenDetailsModel;
