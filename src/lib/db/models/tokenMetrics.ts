import mongoose, { Document, Model } from "mongoose";
import type { TokenMetrics } from "@/types/TokenMetrics";

export interface TokenMetricsDocument
  extends Document,
    Omit<TokenMetrics, "_id"> {}

const holderDistributionSchema = new mongoose.Schema({
  'Top Holder': String,
  'Top 10 Holders': String,
  'Top 25 Holders': String,
  'Top 50 Holders': String,
  'Top 100 Holders': String,
  'Top 250 Holders': String,
  'Distribution Score': String,
  'HHI': String,
  'Median Holder': String,
}, { _id: false });

const tokenMetricsSchema = new mongoose.Schema(
  {
    contract: { type: String, required: true, unique: true },
    holderDistribution: holderDistributionSchema,
    hhi: String,
    medianHolder: String,
    holdersOver10USD: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const TokenMetrics: Model<TokenMetricsDocument> = mongoose.models.TokenMetrics || mongoose.model('TokenMetrics', tokenMetricsSchema);
export default TokenMetrics;