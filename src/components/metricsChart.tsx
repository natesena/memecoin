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
  snapshots: TokenDetails[];
  metric: keyof TokenDetails;
  label: string;
  ticker: string;
}

const MetricsChart = ({
  snapshots,
  metric,
  label,
  ticker,
}: MetricsChartProps) => {
  console.log("Snapshots:", snapshots);
  const formatValue = (value: string) => {
    // Remove currency symbol, commas, and percentage signs
    const cleanValue = value.replace(/[$,%]/g, "");
    // Convert to number
    return parseFloat(cleanValue);
  };

  const chartData = {
    labels: snapshots.map((snapshot) =>
      new Date(snapshot.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${ticker} ${label}`,
        data: snapshots.map((snapshot) =>
          formatValue(snapshot[metric] as string)
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
            if (metric === "holdersToOpenAccountsRatio") {
              return value.toLocaleString() + "%";
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MetricsChart;
