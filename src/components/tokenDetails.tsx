"use client";
import { useEffect, useState } from "react";
import type { TokenDetails } from "@/types/TokenDetails";
import { TokenMetrics } from "@/types/TokenMetrics";

interface TokenDetailsProps {
  contract: string;
}

const TokenDetails = ({ contract }: TokenDetailsProps) => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const response = await fetch(`/api/mongo/token/${contract}`);
        if (!response.ok) {
          throw new Error("Failed to fetch token details");
        }
        const {tokenDetails, tokenMetrics} = await response.json();

        setTokenDetails(tokenDetails);
        setTokenMetrics(tokenMetrics);
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

  if(!tokenMetrics) {
    return <div>No token metrics found</div>;
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
       <div>
        <h2 className="font-semibold">HHI:</h2>
        <p>{tokenMetrics?.hhi}</p>
       </div>
       <div>
        <h2 className="font-semibold">Median Holder:</h2>
        <p>{tokenMetrics?.medianHolder}</p>
       </div>
      <div className="col-span-4 ">
        <h1 className="text-lg underline font-semibold">Holder Distribution</h1>
      <div className="grid grid-cols-4 gap-4 w-full my-4">
      <div>
          <h2 className="font-semibold">Top Holder</h2>
          <p>{tokenMetrics?.holderDistribution['Top Holder']}</p>
        </div>
        <div>
          <h2 className="font-semibold">Top 10 Holders</h2>
          <p>{tokenMetrics?.holderDistribution['Top 10 Holders']}</p>
        </div>
        <div>
          <h2 className="font-semibold">Top 25 Holders</h2>
          <p>{tokenMetrics?.holderDistribution['Top 25 Holders']}</p>
        </div>
        <div>
          <h2 className="font-semibold">Top 50 Holders</h2>
          <p>{tokenMetrics?.holderDistribution['Top 50 Holders']}</p>
        </div>
        <div>
          <h2 className="font-semibold">Top 100 Holders</h2>
          <p>{tokenMetrics?.holderDistribution['Top 100 Holders']}</p>
        </div>
        <div>
          <h2 className="font-semibold">Top 250 Holders</h2>
          <p>{tokenMetrics?.holderDistribution['Top 250 Holders']}</p>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default TokenDetails;
