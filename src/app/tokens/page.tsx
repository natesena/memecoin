"use client";
import { useEffect, useState } from "react";
import { Token } from "@/types/Token";
import TokenHolders from "@/components/tokenholders";

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("/api/mongo/token");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tokens");
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tokens</h1>

      <div className="flex gap-4">
        {/* Scrollable sidebar */}
        <div className="w-80 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {tokens.map((token) => (
            <div
              key={token.url}
              className="border p-3 rounded-lg transition-all duration-200 
                hover:border-green-500 hover:shadow-md hover:scale-[1.02]"
            >
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-gray-500">
                    {token.ticker} • {token.chain}
                  </p>
                </div>
                <div className="text-sm grid grid-cols-2 gap-1">
                  <p>Holders: {token.holders}</p>
                  <p>Rank: {token.rank}</p>
                  <p className="col-span-2">Percentage: {token.percentage}</p>
                  <p className="col-span-2 text-gray-500">
                    Added: {new Date(token.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {tokens.length === 0 && (
            <p className="text-gray-500">No tokens found</p>
          )}
        </div>

        {/* Token Holders section */}
        <div className="flex-1 w-[calc(100%-20rem-1rem)]">
          <TokenHolders tokens={tokens} />
        </div>
      </div>
    </div>
  );
}
