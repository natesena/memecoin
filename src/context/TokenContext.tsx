import { createContext, useContext } from "react";

interface UniqueToken {
  _id: string;
  contract: string;
  ticker: string;
}

interface TokenContextType {
  tokens: UniqueToken[];
  selectedToken: UniqueToken | null;
  setSelectedToken: (token: UniqueToken | null) => void;
}

export const TokenContext = createContext<TokenContextType>({
  tokens: [],
  selectedToken: null,
  setSelectedToken: () => {},
});

export const useTokens = () => useContext(TokenContext);
