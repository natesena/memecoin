"use client";
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
import { Line } from "react-chartjs-2";
import type { TokenDetails } from "@/types/TokenDetails";
import type { TokenMetrics } from "@/types/TokenMetrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsChartProps {
  snapshots: TokenDetails[] | TokenMetrics[];
  metric: string;
  label: string;
  ticker: string;
}

export default function MetricsChart({
  snapshots,
  metric,
  label,
  ticker,
}: MetricsChartProps) {
  const formatValue = (value: string | null | undefined) => {
    if (!value) return 0;
    // Remove currency symbol, commas, and percentage signs
    const cleanValue = value.replace(/[$,%]/g, "");
    // Convert to number
    return parseFloat(cleanValue) || 0;
  };

  const getValue = (snapshot: TokenDetails | TokenMetrics, metric: string) => {
    if (metric.startsWith('holderDistribution.')) {
      const [_, key] = metric.split('.');
      return (snapshot as TokenMetrics).holderDistribution?.[key] || '0';
    }
    return (snapshot as any)[metric]?.toString() || '0';
  };

  const chartData = {
    labels: snapshots.map((snapshot) =>
      new Date(snapshot.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${ticker} ${label}`,
        data: snapshots.map((snapshot) =>
          formatValue(getValue(snapshot, metric))
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${ticker} ${label} Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: number | string) {
            const value = Number(tickValue);
            if (metric.startsWith('holderDistribution.') || metric === "holdersToOpenAccountsRatio") {
              return value.toLocaleString() + "%";
            } else if (metric === "hhi") {
              return value.toLocaleString();
            } else if (metric === "medianHolder") {
              return "$" + value.toLocaleString();
            } else if (
              metric === "marketCap" ||
              metric === "marketCapPerHolder" ||
              metric === "marketCapPerHolderOver10"
            ) {
              return "$" + value.toLocaleString();
            }
            return value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] p-4 border rounded-lg">
      <Line options={options} data={chartData} />
    </div>
  );
}
