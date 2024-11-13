"use client";
import TokenDetails from "@/components/tokenDetails";
import MetricsChart from "@/components/metricsChart";
import { useParams } from "next/navigation";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";
import type { TokenDetails as TokenDetailsType } from "@/types/TokenDetails";
import Link from "next/link";
import { metrics } from "@/lib/metrics/metrics";

export default function DetailsPage() {
  const params = useParams();
  const tokenContract = params.id as string;
  const { tokens, setSelectedToken } = useTokens();
  const [snapshots, setSnapshots] = useState<TokenDetailsType[]>([]);
  const token = tokens.find((t) => t.contract === tokenContract);

  useEffect(() => {
    const token = tokens.find((t) => t.contract === tokenContract);
    if (token) {
      setSelectedToken(token);
    }
  }, [tokenContract, tokens, setSelectedToken]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/mongo/token/${tokenContract}/history`
        );
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setSnapshots(data);
      } catch (error) {
        console.error("Error fetching token history:", error);
      }
    }

    fetchHistory();
  }, [tokenContract]);

  return (
    <div>
      <div className="p-2 border border-gray-700 rounded-lg w-fit hover:border-white text-xs text-gray-600 hover:text-white">
        <Link href="/tokens/holders" className="inline-flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>
      </div>
      <TokenDetails contract={tokenContract} />
      {snapshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {metrics.map((metric) => (
            <MetricsChart
              key={metric.key}
              snapshots={snapshots}
              metric={metric.key}
              label={metric.label}
              ticker={token?.ticker ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
