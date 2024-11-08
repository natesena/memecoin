export interface TokenDetails {
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
