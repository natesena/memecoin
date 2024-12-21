"use client";
import { TokenList } from "@/components/tokenList";
import { useEffect, useState, useRef, useCallback } from "react";
import { TokenContext } from "@/context/TokenContext";
import { TokenProcessState } from "@/types/TokenProcessState";
import { UniqueToken } from "@/types/UniqueToken";

export default function TokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tokens, setTokens] = useState<UniqueToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<UniqueToken | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tokenProcessState, setTokenProcessState] = useState<TokenProcessState[]>([]);
  
  // Use refs to track loading state and current skip value
  const isLoadingRef = useRef(false);
  const skipRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadTokens = useCallback(async () => {
    if (!hasMore || isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      const response = await fetch(`/api/mongo/tokens?skip=${skipRef.current}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      const newTokens = data.tokens;
      setTokens(prev => [...prev, ...newTokens]);
      setHasMore(data.hasMore);
      skipRef.current += newTokens.length;
      
      // Update process state for new tokens
      setTokenProcessState(prev => [
        ...prev,
        ...newTokens.map((token: UniqueToken) => ({
          name: token.ticker,
          contract: token.contract,
          loading: false,
          completed: false,
          error: null,
        }))
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tokens");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [hasMore]);

  // Initial load
  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 50; // Reduced threshold to 50px
    
    if (scrolledToBottom) {
      loadTokens();
    }
  }, [loadTokens, hasMore]);

  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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
      <div className="flex gap-4">
        <TokenContext.Provider
          value={{
            tokens,
            selectedToken,
            setSelectedToken,
            tokenProcessState,
            setTokenProcessState,
          }}
        >
          <aside ref={containerRef} className="w-80 h-[calc(100vh-8rem)] overflow-y-auto border-r pr-4">
            <TokenList tokenProcessState={tokenProcessState} />
            {loading && (
              <div className="h-20 w-full flex items-center justify-center">
                <div className="animate-pulse text-sm text-gray-500">
                  Loading more tokens...
                </div>
              </div>
            )}
          </aside>
          <div className="flex-1 w-[calc(100%-20rem-1rem)] overflow-y-auto max-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </TokenContext.Provider>
      </div>
    </div>
  );
}
