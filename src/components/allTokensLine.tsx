"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
import { metrics } from "@/lib/metrics/metrics";
import { MetricKey } from "@/types/MetricKey";
import { formatTokenDetailsSnapshot } from "@/utils/formatTokenDetailsSnapshot";

interface ProcessedToken {
  name: string;
  contract: string;
  snapshots: TokenDetails[];
}

interface AllTokensLineProps {
  tokens: ProcessedToken[];
  metric: MetricKey;
  label: string;
}

interface TooltipContext {
  datasetIndex: number;
  parsed: {
    y: number;
  };
}

const AllTokensLine = ({ tokens, metric, label }: AllTokensLineProps) => {
  const maxValueForMetric =
    metrics[metrics.findIndex((m) => m.key === metric)]?.maxValue || 0;
  const [activeMaxValue, setActiveMaxValue] = useState<number>(
    maxValueForMetric || 0
  );

  useEffect(() => {
    console.log(tokens.length, "tokens");
    let maxValueInSnapshots = 0;
    let tokenWithMaxValue = "";

    // Find max value and corresponding token
    tokens.forEach((token) => {
      if (token.snapshots.length >= 2) {
        // Update each snapshot's metrics with properly formatted values
        token.snapshots = token.snapshots.map((snapshot) => {
          const formattedSnapshot = { ...snapshot };
          // Only format metrics that are actual metric keys
          metrics.forEach(({ key }) => {
            const value = snapshot[key as keyof TokenDetails];
            if (value !== undefined) {
              (formattedSnapshot as Record<string, unknown>)[key] =
                formatTokenDetailsSnapshot(key as MetricKey, String(value));
            }
          });
          return formattedSnapshot;
        });

        // Now check for max values using the formatted values
        token.snapshots.forEach((snapshot) => {
          const value = Number(snapshot[metric]);
          if (value > maxValueInSnapshots) {
            maxValueInSnapshots = value;
            tokenWithMaxValue = token.name;
          }
        });
      }
    });

    console.log(
      `Max value ${maxValueInSnapshots} found in token: ${tokenWithMaxValue}`
    );

    // Recalculate max value
    const maxValue = Math.min(maxValueForMetric, maxValueInSnapshots);

    if (maxValue > activeMaxValue) {
      console.log(metric, tokenWithMaxValue, maxValueInSnapshots, maxValue);
      setActiveMaxValue(maxValueInSnapshots);
    } else {
      setActiveMaxValue(maxValue);
    }
  }, [tokens, metric, activeMaxValue, maxValueForMetric]);

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
  const yAxisMax = Math.ceil(activeMaxValue * 1.1);

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
        y: Number(String(snapshot[metric]).replace(/[$,%]/g, "")),
      })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length]
        .replace("rgb", "rgba")
        .replace(")", ", 0.5)"),
      tension: 0.1,
      pointRadius: 0,
      hoverRadius: 6,
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
        text: label,
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
        mode: "dataset" as const, // This mode checks the closest dataset based on x-axis positioning.
        intersect: false, // Allows the tooltip to appear when hovering over the line segment.
        callbacks: {
          label: (context: TooltipContext) => {
            const token = tokens[context.datasetIndex];
            return `${token.name}: ${Number(
              context.parsed.y
            ).toLocaleString()} holders`;
          },
        },
      },
    },
    interaction: {
      mode: "index" as const, // Consistent with the tooltip mode.
      axis: "xy" as const, // This will help detect the line regardless of axis positioning.
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
      mode: "nearest" as const,
      intersect: false,
    },
  };
  console.log(metric);
  return (
    <div className="w-full h-[600px] p-4">
      <h1>{metric}</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AllTokensLine;
