"use client";
import { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { UniqueToken } from "@/types/UniqueToken";

interface TokenHistory {
  contract: string;
  ticker: string;
  snapshots: {
    holders: string;
    scannedAt: string;
  }[];
}

const TokenHolders = ({ tokens }: { tokens: UniqueToken[] }) => {
  const [tokenHistories, setTokenHistories] = useState<TokenHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    if (fetchInProgress.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }

    fetchInProgress.current = true;

    const uniqueTokens = Array.from(new Set(tokens.map((t) => t.contract))).map(
      (contract) => tokens.find((t) => t.contract === contract)!
    );

    console.log("========= Token Fetch Start =========");
    console.table(uniqueTokens);

    const fetchTokenHistory = async (token: UniqueToken) => {
      try {
        console.log(
          `\n[${new Date().toLocaleTimeString()}] Fetching ${token.ticker}...`
        );
        const response = await fetch(
          `/api/mongo/token/${token.contract}/history`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch history for ${token.ticker}`);
        const data = await response.json();

        console.log(
          `[${new Date().toLocaleTimeString()}] Received ${
            data.length
          } snapshots for ${token.ticker}`
        );

        setTokenHistories((prev) => {
          const filtered = prev.filter((h) => h.contract !== token.contract);
          return [
            ...filtered,
            {
              contract: token.contract,
              ticker: token.ticker,
              snapshots: data,
            },
          ];
        });
      } catch (err) {
        console.error(
          `[${new Date().toLocaleTimeString()}] Error with ${token.ticker}:`,
          err
        );
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    setTokenHistories([]);
    setLoading(true);
    setError(null);

    uniqueTokens.forEach((token, index) => {
      setTimeout(() => {
        fetchTokenHistory(token).finally(() => {
          if (index === uniqueTokens.length - 1) {
            console.log("========= Token Fetch Complete =========");
            setLoading(false);
            fetchInProgress.current = false;
          }
        });
      }, index * 500);
    });

    return () => {
      console.log("========= Cleanup =========");
    };
  }, [tokens]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Token Holder History</h2>
      {loading && <div>Loading more tokens...</div>}
      <div className="space-y-4">
        {tokenHistories.map((history) => (
          <div key={history.contract} className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{history.ticker}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {history.snapshots.map((snapshot, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {new Date(snapshot.scannedAt).toLocaleDateString()}
                  </span>
                  <span>{snapshot.holders}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenHolders;
