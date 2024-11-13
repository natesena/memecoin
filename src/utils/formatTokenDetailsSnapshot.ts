import { MetricKey } from "@/types/MetricKey";

// holders: 3108
// holdersOver10: "3108 (50.13%)"
// marketCap: 2.75M
// marketCapPerHolder: $444.18
// marketCapPerHolderOver10: $886.06

export const formatTokenDetailsSnapshot = (
  metricKey: MetricKey,
  value: string
): number => {
  // Remove any commas and $ signs first
  const cleanValue = value.replace(/,|\$/g, "");

  switch (metricKey) {
    case "holders":
    case "holdersOver10":
      // Extract just the number before the parentheses if it exists
      return parseInt(cleanValue.split(" ")[0]);

    case "marketCap":
      if (cleanValue.includes("M")) {
        return parseFloat(cleanValue.replace("M", "")) * 1_000_000;
      }
      if (cleanValue.includes("B")) {
        return parseFloat(cleanValue.replace("B", "")) * 1_000_000_000;
      }
      return parseFloat(cleanValue);

    case "marketCapPerHolder":
    case "marketCapPerHolderOver10":
      return parseFloat(cleanValue);

    default:
      console.warn(`Unhandled metric key: ${metricKey}`);
      return parseFloat(cleanValue);
  }
};

// Usage examples:
// formatTokenDetailsSnapshot("holders", "3108") => 3108
// formatTokenDetailsSnapshot("holdersOver10", "3108 (50.13%)") => 3108
// formatTokenDetailsSnapshot("marketCap", "2.75M") => 2750000
// formatTokenDetailsSnapshot("marketCapPerHolder", "$444.18") => 444.18
