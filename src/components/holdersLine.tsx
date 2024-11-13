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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import type { TokenDetails } from "@/types/TokenDetails";

interface HoldersLineProps {
  snapshots: TokenDetails[];
  ticker: string;
}

const HoldersLine = ({ snapshots, ticker }: HoldersLineProps) => {
  const chartData = {
    labels: snapshots.map((snapshot) =>
      new Date(snapshot.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${ticker} Holders`,
        data: snapshots.map((snapshot) =>
          parseInt(snapshot.holders.replace(/,/g, ""))
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
        text: `${ticker} Holder Count Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: number | string) {
            return Number(tickValue).toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HoldersLine;
