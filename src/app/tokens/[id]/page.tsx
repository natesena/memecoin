"use client";
import TokenDetails from "@/components/tokenDetails";
import HoldersLine from "@/components/holdersLine";
import { useParams } from "next/navigation";
import { useTokens } from "@/context/TokenContext";
import { useEffect, useState } from "react";

interface TokenSnapshot {
  holders: string;
  scannedAt: string;
}

export default function DetailsPage() {
  const params = useParams();
  const tokenContract = params.id as string;
  const { tokens, setSelectedToken } = useTokens();
  const [snapshots, setSnapshots] = useState<TokenSnapshot[]>([]);
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
      <TokenDetails contract={tokenContract} />
      <HoldersLine snapshots={snapshots} ticker={token?.ticker ?? ""} />
    </div>
  );
}
