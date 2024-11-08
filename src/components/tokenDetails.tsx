"use client";
import { useEffect, useState } from "react";
import type { TokenDetails } from "@/types/TokenDetails";

interface TokenDetailsProps {
  contract: string;
}

const TokenDetails = ({ contract }: TokenDetailsProps) => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const response = await fetch(`/api/mongo/token/${contract}`);
        if (!response.ok) {
          throw new Error("Failed to fetch token details");
        }
        const data = await response.json();
        setTokenDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetails();
  }, [contract]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tokenDetails) {
    return <div>No token details found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {tokenDetails.name} ({tokenDetails.ticker})
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="font-semibold">Holders</h2>
          <p>{tokenDetails.holders}</p>
        </div>
        <div>
          <h2 className="font-semibold">Holders Over 10</h2>
          <p>{tokenDetails.holdersOver10}</p>
        </div>
        <div>
          <h2 className="font-semibold">Market Cap</h2>
          <p>{tokenDetails.marketCap}</p>
        </div>
        <div>
          <h2 className="font-semibold">Last Updated</h2>
          <p>{tokenDetails.lastUpdated?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
