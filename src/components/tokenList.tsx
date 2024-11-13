import { TokenProcessState } from "@/types/TokenProcessState";
import TokenListElement from "@/components/token/token";
import { useState } from "react";

export function TokenList({
  tokenProcessState,
}: {
  tokenProcessState: TokenProcessState[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokenProcessState.filter(
    (token) =>
      token.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search tokens..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg 
          bg-gray-50 dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          border-gray-200 dark:border-gray-700
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
      />
      <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto px-2">
        {filteredTokens.map((token) => (
          <TokenListElement token={token} key={token.contract} />
        ))}
      </div>
    </div>
  );
}
