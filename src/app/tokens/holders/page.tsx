"use client";
import AllTokensLine from "@/components/allTokensLine";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";
import { TokenDetails } from "@/types/TokenDetails";
import { db } from "@/lib/db";
import { TokenProcessState } from "@/types/TokenProcessState";
import { metrics } from "@/lib/metrics/metrics";
import { MetricKey } from "@/types/MetricKey";
import { UniqueToken } from "@/types/UniqueToken";

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
  const { tokens } = useTokens();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("holders");

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

          // Only add delay between requests if we actually made an API call
          if (i < tokens.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
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
      }
    };

    const updateTokenState = (
      token: UniqueToken,
      tokenDetailsArray: TokenDetails[]
    ) => {
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
    return () => {};
  }, [tokens]);

  return (
    <div className="space-y-4">
      <div style={{ display: "none" }}>
        {tokenProcessState.map((token) => (
          <div key={token.contract}>
            {token.name}- {token.completed ? "✅" : "❌"}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key as MetricKey)}
            className={`px-4 py-2 rounded transition-colors ${
              selectedMetric === metric.key
                ? "bg-white text-black border border-black"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>
      <div>
        <AllTokensLine
          tokens={processedTokens}
          metric={selectedMetric}
          label={metrics.find((m) => m.key === selectedMetric)?.label || ""}
        />
      </div>
    </div>
  );
}
