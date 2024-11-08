export interface Token {
  url: string;
  ticker: string;
  name: string;
  holders: string;
  rank: string;
  percentage: string;
  chain: string;
  createdAt: string | Date;
}

export interface TokenHistory {
  date: string;
  holders: number;
  token: Token;
}
