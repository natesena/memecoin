export interface HolderSnapshot {
  _id: string;
  contract: string;
  ticker: string;
  name: string;
  holders: string;
  rank: string;
  percentage: string;
  chain: string;
  scannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
