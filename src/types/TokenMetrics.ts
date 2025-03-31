export interface HolderDistribution {
  'Top Holder': string;
  'Top 10 Holders': string;
  'Top 25 Holders': string;
  'Top 50 Holders': string;
  'Top 100 Holders': string;
  'Top 250 Holders': string;
}

export interface TokenMetrics {
  _id: string;
  contract: string;
  holderDistribution: HolderDistribution;
  hhi: string;
  medianHolder: string;
  holdersOver10USD: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}
