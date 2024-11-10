"use client";
import TokenHolders from "@/components/tokenholders";
import AllTokensLine from "@/components/allTokensLine";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";
import { TokenDetails } from "@/types/TokenDetails";

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

    // Create an async function to fetch data for all tokens
    const fetchTokenData = async () => {
      let globalMaxHolders = 0;

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
          const data = await response.json();

          if ("error" in data) {
            setTokenProcessState((prevState) =>
              prevState.map((stateToken) =>
                stateToken.contract === token.contract
                  ? {
                      ...stateToken,
                      loading: false,
                      completed: false,
                      error: data.error,
                    }
                  : stateToken
              )
            );
            continue; // Skip to next token
          }

          // Now we know data is TokenDetails[]
          const tokenDetailsArray: TokenDetails[] = data;

          // Find max holders across all snapshots
          tokenDetailsArray.forEach((snapshot) => {
            const holders = parseInt(
              snapshot.holders?.replace(/,/g, "") || "0"
            );
            if (!isNaN(holders) && holders > globalMaxHolders) {
              globalMaxHolders = holders;
            }
          });

          setMaxHolders(globalMaxHolders);

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

          // Unnest the data when setting processed tokens
          setProcessedTokens((prevState) => {
            const tokenExists = prevState.some(
              (t) => t.contract === token.contract
            );

            if (tokenExists) {
              return prevState;
            }

            return [
              ...prevState,
              {
                name: token.ticker || "",
                contract: token.contract,
                snapshots: tokenDetailsArray,
              },
            ];
          });

          // Calculate max holders for this token
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
