"use client";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale
);
import { TokenDetails } from "@/types/TokenDetails";

interface ProcessedToken {
  name: string;
  contract: string;
  snapshots: TokenDetails[];
}

interface AllTokensLineProps {
  tokens: ProcessedToken[];
  maxHolders: number;
}

const AllTokensLine = ({ tokens, maxHolders }: AllTokensLineProps) => {
  const [activeToken, setActiveToken] = useState<string | null>(null);

  // Get all unique timestamps and find the earliest date
  const allDates = [
    ...new Set(
      tokens.flatMap((token) =>
        token.snapshots.map((snapshot) => snapshot.createdAt)
      )
    ),
  ].sort();

  const minDate = allDates.length > 0 ? allDates[0] : new Date().toISOString();

  // Remove the maxHolders calculation block and just use the prop
  const yAxisMax = Math.ceil(maxHolders * 1.1);

  const colors = [
    "rgb(75, 192, 192)",
    "rgb(255, 99, 132)",
    "rgb(53, 162, 235)",
    "rgb(255, 205, 86)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
  ];

  // Add this before the chart data setup
  tokens.forEach((token) => {
    token.snapshots.forEach((snapshot) => {
      const date = new Date(snapshot.createdAt);
      if (date.getTime() === 0 || isNaN(date.getTime())) {
      }
    });
  });

  const chartData = {
    datasets: tokens.map((token, index) => ({
      label: token.name,
      data: token.snapshots.map((snapshot) => ({
        x: new Date(snapshot.createdAt).getTime(),
        y: Number(snapshot.holders.replace(/,/g, "")),
      })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length]
        .replace("rgb", "rgba")
        .replace(")", ", 0.5)"),
      tension: 0.1,
      pointRadius: 0, // Increase the point size slightly
      hoverRadius: 6, // Make the hover detection area larger
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
      tooltip: {
        enabled: true,
        mode: "dataset", // This mode checks the closest dataset based on x-axis positioning.
        intersect: false, // Allows the tooltip to appear when hovering over the line segment.
        callbacks: {
          label: (context: any) => {
            const token = tokens[context.datasetIndex];
            return `${token.name}: ${Number(
              context.parsed.y
            ).toLocaleString()} holders`;
          },
        },
      },
    },
    interaction: {
      mode: "index", // Consistent with the tooltip mode.
      axis: "xy", // This will help detect the line regardless of axis positioning.
      intersect: false, // Allows interaction with the line itself, not just points.
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss.SSS",
            second: "HH:mm:ss",
            minute: "HH:mm",
            hour: "MMM d, HH:mm",
            day: "MMM d",
            week: "MMM d",
            month: "MMM yyyy",
            quarter: "MMM yyyy",
            year: "yyyy",
          },
          tooltipFormat: "MMM d, HH:mm",
        },
        title: {
          display: true,
          text: "Date & Time",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
        min: new Date(minDate).getTime(),
      },
      y: {
        type: "linear" as const,
        min: 0,
        max: yAxisMax,
        title: {
          display: true,
          text: "Number of Holders",
        },
        ticks: {
          callback: function (tickValue: number | string) {
            return Number(tickValue).toLocaleString();
          },
        },
      },
    },
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: false,
    },
  };

  return (
    <div className="w-full h-[600px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AllTokensLine;
