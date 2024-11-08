"use client";
import TokenHolders from "@/components/tokenholders";
import AllTokensLine from "@/components/allTokensLine";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";

interface Snapshot {
  _id: string;
  contract: string;
  ticker: string;
  holders: string;
  scannedAt: Date;
}

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
  snapshots: Snapshot[];
}

export default function HoldersPage() {
  const [tokenProcessState, setTokenProcessState] = useState<
    TokenProcessState[]
  >([]);
  const [processedTokens, setProcessedTokens] = useState<ProcessedToken[]>([]);
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

    // Create an async function to fetch data for all tokens
    const fetchTokenData = async () => {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        setTokenProcessState((prevState) =>
          prevState.map((stateToken) =>
            stateToken.contract === token.contract
              ? { ...stateToken, loading: true }
              : stateToken
          )
        );

        try {
          const response = await fetch(
            `/api/mongo/token/${token.contract}/history`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch history for ${token.ticker}`);
          }
          const snapshots = await response.json();
          console.log("found", snapshots.length, "snapshots");
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
          setProcessedTokens((prevState) => [
            ...prevState,
            { name: token.ticker, contract: token.contract, snapshots },
          ]);
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

    fetchTokenData();

    // Cleanup function to handle component unmounting
    return () => {
      // Could add abort controller here if needed
    };
  }, [tokens]);
  {
    console.log("tokenProcessState:", tokenProcessState);
  }
  return (
    <div>
      <div className="h-[25vh] overflow-y-auto">
        {tokenProcessState.map((token) => (
          <div key={token.contract}>
            {token.name} -{" "}
            {token.completed ? "done" : token.loading ? "loading" : "queued"}
          </div>
        ))}
      </div>
      <div>
        <AllTokensLine tokens={processedTokens} />
      </div>
    </div>
  );
}
