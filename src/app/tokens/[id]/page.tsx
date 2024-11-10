"use client";
import TokenDetails from "@/components/tokenDetails";
import MetricsChart from "@/components/metricsChart";
import { useParams } from "next/navigation";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";
import type { TokenDetails as TokenDetailsType } from "@/types/TokenDetails";

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
        console.log("Data:", data);
        setSnapshots(data);
      } catch (error) {
        console.error("Error fetching token history:", error);
      }
    }

    fetchHistory();
  }, [tokenContract]);

  const metrics = [
    { key: "holders", label: "Total Holders" },
    { key: "holdersOver10", label: "Holders Over 10" },
    { key: "marketCap", label: "Market Cap" },
    { key: "marketCapPerHolder", label: "Market Cap per Holder" },
    { key: "marketCapPerHolderOver10", label: "Market Cap per Holder (>10)" },
  ];

  return (
    <div>
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
