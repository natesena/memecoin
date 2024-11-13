import type { TokenDetails } from "./TokenDetails";

export type Details = Pick<
  TokenDetails,
  | "holders"
  | "holdersOver10"
  | "marketCap"
  | "marketCapPerHolder"
  | "marketCapPerHolderOver10"
  | "createdAt"
>;
