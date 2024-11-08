"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

interface Snapshot {
  _id: string;
  contract: string;
  ticker: string;
  holders: string;
  scannedAt: Date;
}

interface ProcessedToken {
  name: string;
  contract: string;
  snapshots: Snapshot[];
}

const AllTokensLine = ({ tokens }: { tokens: ProcessedToken[] }) => {
  // Get all unique dates
  const allDates = [
    ...new Set(
      tokens.flatMap((token) =>
        token.snapshots.map(
          (snapshot) => new Date(snapshot.scannedAt).toISOString().split("T")[0]
        )
      )
    ),
  ].sort();

  // Calculate the maximum Y value more precisely
  const maxHolders = Math.max(
    ...tokens.flatMap((token) =>
      token.snapshots.map((snapshot) => {
        const holders = parseInt(snapshot.holders.replace(/,/g, ""));
        return isNaN(holders) ? 0 : holders;
      })
    )
  );

  // Add exactly 10% padding to the max value
  const yAxisMax = maxHolders + maxHolders * 0.1;

  const colors = [
    "rgb(75, 192, 192)",
    "rgb(255, 99, 132)",
    "rgb(53, 162, 235)",
    "rgb(255, 205, 86)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
  ];

  const chartData = {
    labels: allDates,
    datasets: tokens.map((token, index) => ({
      label: token.name,
      data: token.snapshots.map((snapshot) => {
        const holders = parseInt(snapshot.holders.replace(/,/g, ""));
        return {
          x: new Date(snapshot.scannedAt).toISOString().split("T")[0],
          y: isNaN(holders) ? 0 : holders,
        };
      }),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length]
        .replace("rgb", "rgba")
        .replace(")", ", 0.5)"),
      tension: 0.1,
      pointRadius: 0,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Token Holders Over Time",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: 0,
        max: yAxisMax,
        title: {
          display: true,
          text: "Number of Holders",
        },
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString();
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[600px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AllTokensLine;
