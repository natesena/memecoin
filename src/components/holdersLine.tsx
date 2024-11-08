"use client";
import { useEffect } from "react";
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

interface TokenSnapshot {
  holders: string;
  scannedAt: string;
}

interface HoldersLineProps {
  snapshots: TokenSnapshot[];
  ticker: string;
}

const HoldersLine = ({ snapshots, ticker }: HoldersLineProps) => {
  const chartData = {
    labels: snapshots.map((snapshot) =>
      new Date(snapshot.scannedAt).toLocaleDateString()
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
        beginAtZero: false,
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
