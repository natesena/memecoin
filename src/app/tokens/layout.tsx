"use client";
import { TokenList } from "@/components/tokenList";
import { useEffect, useState } from "react";
import { TokenContext } from "@/context/TokenContext";
import { TokenProcessState } from "@/types/TokenProcessState";

interface UniqueToken {
  _id: string;
  contract: string;
  ticker: string;
}

export default function TokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tokens, setTokens] = useState<UniqueToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<UniqueToken | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tokenProcessState, setTokenProcessState] = useState<
    TokenProcessState[]
  >([]);

  // Check if authorized before showing the layout
  const isAuthorized = document.cookie.includes(
    "memecoin_terminal_isAuthorized=true"
  );
  if (!isAuthorized) {
    return <div>{children}</div>;
  }

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("/api/mongo/tokens");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setTokens(data);
        // Initialize process state for each token
        setTokenProcessState(
          data.map((token: UniqueToken) => ({
            name: token.ticker,
            contract: token.contract,
            loading: false,
            completed: false,
            error: null,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tokens");
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, []);

  // Return a loading skeleton that matches the final layout just for ~aesthetics
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-80 animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex-1 w-[calc(100%-20rem-1rem)] animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Tokens</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tokens</h1>
      <div className="flex gap-4">
        <TokenContext.Provider
          value={{
            tokens,
            selectedToken,
            setSelectedToken: (token) => setSelectedToken(token as any),
            tokenProcessState,
            setTokenProcessState,
          }}
        >
          <aside className="w-80 h-[calc(100vh-8rem)] overflow-y-auto border-r pr-4">
            <TokenList tokenProcessState={tokenProcessState} />
          </aside>
          <div className="flex-1 w-[calc(100%-20rem-1rem)] overflow-y-auto max-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </TokenContext.Provider>
      </div>
    </div>
  );
}
