"use client";
import TokenHolders from "@/components/tokenholders";
import AllTokensLine from "@/components/allTokensLine";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";
import { TokenDetails } from "@/types/TokenDetails";
import { db } from "@/lib/db";

interface TokenProcessState {
  name: string;
  contract: string;
  loading: boolean;
  completed: boolean;
  error: string | null;
}

interface ProcessedToken {
  name: string;
  contract: string;
  snapshots: TokenDetails[];
}

export default function HoldersPage() {
  const [tokenProcessState, setTokenProcessState] = useState<
    TokenProcessState[]
  >([]);
  const [processedTokens, setProcessedTokens] = useState<ProcessedToken[]>([]);
  const [maxHolders, setMaxHolders] = useState<number>(0);
  const { tokens } = useTokens();

  useEffect(() => {
    setTokenProcessState(
      tokens.map((token) => ({
        name: token.ticker,
        contract: token.contract,
        loading: false,
        completed: false,
        snapshots: [],
        error: null,
      }))
    );
  }, [tokens]);

  useEffect(() => {
    // Reset state when tokens change
    setTokenProcessState(
      tokens.map((token) => ({
        name: token.ticker,
        contract: token.contract,
        loading: false,
        completed: false,
        snapshots: [],
        error: null,
      }))
    );
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const fetchTokenData = async () => {
      let globalMaxHolders = 0;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        try {
          // Check cache first
          const cachedData = await db.tokenHistory
            .where("contract")
            .equals(token.contract)
            .first();

          // Use cache if it exists and is not expired
          if (
            cachedData &&
            Date.now() - cachedData.timestamp < CACHE_DURATION
          ) {
            console.log(`Using cached data for ${token.ticker}`);
            updateTokenState(token, cachedData.data);
            continue;
          }

          // If no cache or expired, fetch from API
          setTokenProcessState((prevState) =>
            prevState.map((stateToken) =>
              stateToken.contract === token.contract
                ? { ...stateToken, loading: true }
                : stateToken
            )
          );

          const response = await fetch(
            `/api/mongo/token/${token.contract}/history`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch history for ${token.ticker}`);
          }
          const data = await response.json();

          if ("error" in data) {
            throw new Error(data.error);
          }

          // Cache the new data
          await db.tokenHistory.put({
            contract: token.contract,
            data: data,
            timestamp: Date.now(),
          });

          // Update state with the new data
          updateTokenState(token, data);
        } catch (error) {
          setTokenProcessState((prevState) =>
            prevState.map((stateToken) =>
              stateToken.contract === token.contract
                ? {
                    ...stateToken,
                    loading: false,
                    completed: false,
                    error:
                      error instanceof Error
                        ? error.message
                        : "Failed to fetch history",
                  }
                : stateToken
            )
          );
        }

        // Add delay between requests
        if (i < tokens.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    const updateTokenState = (
      token: any,
      tokenDetailsArray: TokenDetails[]
    ) => {
      // Update max holders
      if (tokenDetailsArray.length >= 2) {
        tokenDetailsArray.forEach((snapshot) => {
          const holders = parseInt(snapshot.holders?.replace(/,/g, "") || "0");
          if (!isNaN(holders)) {
            setMaxHolders((prev) => Math.max(prev, holders));
          }
        });
      }

      // Update token process state
      setTokenProcessState((prevState) =>
        prevState.map((stateToken) =>
          stateToken.contract === token.contract
            ? {
                ...stateToken,
                loading: false,
                completed: true,
                error: null,
              }
            : stateToken
        )
      );

      // Update processed tokens
      setProcessedTokens((prevState) => {
        const tokenExists = prevState.some(
          (t) => t.contract === token.contract
        );
        if (tokenExists) return prevState;
        return [
          ...prevState,
          {
            name: token.ticker || "",
            contract: token.contract,
            snapshots: tokenDetailsArray,
          },
        ];
      });
    };

    fetchTokenData();

    // Cleanup function to handle component unmounting
    return () => {
      // Could add abort controller here if needed
    };
  }, [tokens]);

  return (
    <div>
      <div className="h-[25vh] overflow-y-auto">
        {tokenProcessState.map((token) => (
          <div key={token.contract}>
            {token.name} -{" "}
            {token.completed
              ? "done"
              : token.loading
              ? "loading"
              : token.error
              ? "error"
              : "queued"}
          </div>
        ))}
      </div>
      <div>
        <h1>Processed Tokens</h1>
        {/* {processedTokens.map((token) => (
          <div key={token.contract}>
            <h1>{token.name}</h1>
            {token.snapshots.map((snapshot, index) => (
              <p key={index}>{JSON.stringify(snapshot, null, 2)}</p>
            ))}
          </div>
        ))} */}
      </div>
      <div>
        <AllTokensLine tokens={processedTokens} maxHolders={maxHolders} />
      </div>
    </div>
  );
}
