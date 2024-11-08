import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  url: { type: String, required: true },
  ticker: { type: String, required: true },
  name: { type: String, required: true },
  holders: { type: String, required: true },
  rank: { type: String, required: true },
  percentage: { type: String, required: true },
  chain: { type: String, required: true },
});

export const Token =
  mongoose.models.Token || mongoose.model("Token", tokenSchema);
