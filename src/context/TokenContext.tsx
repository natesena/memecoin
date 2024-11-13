import { createContext, useContext } from "react";
import { TokenProcessState } from "@/types/TokenProcessState";
import { UniqueToken } from "@/types/UniqueToken";

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
