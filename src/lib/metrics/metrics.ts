export const metrics = [
  { key: "holders", label: "Total Holders", maxValue: 100000000 },
  { key: "holdersOver10", label: "Holders Over 10", maxValue: 100000000 },
  { key: "marketCap", label: "Market Cap", maxValue: 1000000000 },
  {
    key: "marketCapPerHolder",
    label: "Market Cap per Holder",
    maxValue: 2000,
  },
  {
    key: "marketCapPerHolderOver10",
    label: "Market Cap per Holder (>10)",
    maxValue: 2000,
  },
];

export const tokenMetrics = [
  { key: "hhi", label: "HHI", maxValue: 100000000 },
  { key: "medianHolder", label: "Median Holder Value", maxValue: 100000000 },
  { key: "holderDistribution.Top Holder", label: "Top Holder %", maxValue: 100 },
  { key: "holderDistribution.Top 10 Holders", label: "Top 10 Holders %", maxValue: 100 },
  { key: "holderDistribution.Top 25 Holders", label: "Top 25 Holders %", maxValue: 100 },
  { key: "holderDistribution.Top 50 Holders", label: "Top 50 Holders %", maxValue: 100 },
  { key: "holderDistribution.Top 100 Holders", label: "Top 100 Holders %", maxValue: 100 },
  { key: "holderDistribution.Top 250 Holders", label: "Top 250 Holders %", maxValue: 100 }
];
