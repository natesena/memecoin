import Dexie, { Table } from "dexie";
import { TokenDetails } from "@/types/TokenDetails";

interface TokenHistoryEntry {
  contract: string;
  data: TokenDetails[];
  timestamp: number;
}

export class TokenDatabase extends Dexie {
  tokenHistory!: Table<TokenHistoryEntry>;
  searchCache!: Table<{ query: string; results: TokenDetails[]; timestamp: number }>;

  constructor() {
    super("TokenDatabase");
    this.version(1).stores({
      tokenHistory: "contract, timestamp",
      searchCache: "query, timestamp"
    });
  }
}

export const db = new TokenDatabase();
