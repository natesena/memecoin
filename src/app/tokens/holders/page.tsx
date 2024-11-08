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
  snapshots: Snapshot[];
  error: string | null;
}

export default function HoldersPage() {
  const [tokenProcessState, setTokenProcessState] = useState<
    TokenProcessState[]
  >([]);
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
                    snapshots: snapshots.length > 0 ? snapshots : null,
                    error: null,
                  }
                : stateToken
            )
          );
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
        <h1>Loaded Coins</h1>

        {tokenProcessState.map(
          (token) =>
            token.completed && (
              <div key={token.contract}>
                <h3>{token.name}</h3>
                {token.snapshots.length > 0 ? (
                  <div>
                    {token.snapshots.map((snapshot: any) => (
                      <div key={snapshot._id}>{snapshot.scannedAt}</div>
                    ))}
                  </div>
                ) : (
                  <div>No snapshots found</div>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}
