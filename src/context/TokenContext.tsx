import { createContext, useContext } from "react";
import { TokenProcessState } from "@/types/TokenProcessState";

interface UniqueToken {
  _id: string;
  contract: string;
  ticker: string;
}

interface TokenContextType {
  tokens: UniqueToken[];
  selectedToken: UniqueToken | null;
  setSelectedToken: (token: UniqueToken | null) => void;
  tokenProcessState: TokenProcessState[];
  setTokenProcessState: (state: TokenProcessState[]) => void;
}

export const TokenContext = createContext<TokenContextType>({
  tokens: [],
  selectedToken: null,
  setSelectedToken: () => {},
  tokenProcessState: [],
  setTokenProcessState: () => {},
});

export const useTokens = () => useContext(TokenContext);
