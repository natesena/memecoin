"use client";
import { TokenList } from "@/components/tokenList";
import { useEffect, useState, useRef, useCallback } from "react";
import { TokenContext } from "@/context/TokenContext";
import { TokenProcessState } from "@/types/TokenProcessState";
import { UniqueToken } from "@/types/UniqueToken";
import debounce from 'lodash/debounce';
import { db } from "@/lib/db";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [tokenProcessState, setTokenProcessState] = useState<TokenProcessState[]>([]);
  const [noResults, setNoResults] = useState(false);
  
  const isLoadingRef = useRef(false);
  const skipRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetState = useCallback(() => {
    skipRef.current = 0;
    setTokens([]);
    setTokenProcessState([]);
    setHasMore(true);
    setError("");
  }, []);

  const clearSearch = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
    resetState();
  }, [resetState]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Reset error state
    setError("");
    setNoResults(false);
    
    
    // Validate contract address format if it looks like one
    if (value.startsWith("0x") && value.length !== 42) {
      setError("Invalid contract address format");
      return;
    }
    
    setInputValue(value);
    debouncedSearch(value);
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      resetState();
    }, 500),
    [resetState]
  );

  const loadTokens = useCallback(async () => {
    if (!hasMore || isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError("");
      
      const queryParams = new URLSearchParams({
        skip: skipRef.current.toString(),
        ...(searchQuery && { query: searchQuery })
      });

      // Check cache first if it's a search query and first page
      let data;
      if (searchQuery && skipRef.current === 0) {
        const cachedResult = await db.searchCache
          .where('query')
          .equals(searchQuery)
          .first();
        
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
          data = {
            tokens: cachedResult.results,
            hasMore: false, // Cached results are complete
            total: cachedResult.results.length
          };
        }
      }
      
      // If no cache or expired, fetch from API
      if (!data) {
        const response = await fetch(`/api/mongo/tokens?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        data = await response.json();
        
        // Cache the results if it's a search query
        if (searchQuery && skipRef.current === 0) {
          await db.searchCache.put({
            query: searchQuery,
            results: data.tokens,
            timestamp: Date.now()
          });
        }
      }
      
      // Check for no results
      if (data.tokens.length === 0 && skipRef.current === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      
      setTokens(prev => [...prev, ...data.tokens]);
      setHasMore(data.hasMore);
      skipRef.current += data.tokens.length;
      
      setTokenProcessState(prev => [
        ...prev,
        ...data.tokens.map((token: UniqueToken) => ({
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
  }, [hasMore, searchQuery]);

  // Initial load
  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  // Effect to reload tokens when search query changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      loadTokens();
    }
  }, [searchQuery, loadTokens]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 50;
    
    if (scrolledToBottom) {
      loadTokens();
    }
  }, [loadTokens, hasMore]);

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
            <TokenList 
              tokenProcessState={tokenProcessState}
              inputValue={inputValue}
              handleSearchChange={handleSearchChange}
              clearSearch={clearSearch}
              loading={loading}
            />
            {noResults && (
              <div className="text-gray-500 p-4">
                No results found for <span className="text-white font-bold">{inputValue}</span>
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
