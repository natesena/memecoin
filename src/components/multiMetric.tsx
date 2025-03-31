"use client";
import React, { useRef } from "react";
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
import type { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Scatter } from "react-chartjs-2";
import type { TokenDetails } from "@/types/TokenDetails";
import type { TokenMetrics, HolderDistribution } from "@/types/TokenMetrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface MetricsChartProps {
  snapshotA: TokenDetails[] | TokenMetrics[];
  snapshotB: TokenDetails[] | TokenMetrics[];
  metricA: string;
  metricB: string;
  labelA: string;
  tickerA: string;
  labelB: string;
  tickerB: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const zoomOptions = {
  pan: {
    enabled: true,
    mode: "xy" as const,
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: "y" as const,
  },
};

export default function MultiChart({
  snapshotA,
  snapshotB,
  metricA,
  metricB,
  labelA,
  tickerA,
  labelB,
}: MetricsChartProps) {
  const chartRef = useRef<Chart<
    "scatter",
    (number | [number, number] | { x: number; y: number } | null)[],
    unknown
  > | null>(null);

  const formatValue = (value: string | null | undefined) => {
    if (!value) return null;

    // Remove currency symbol, commas, and percentage signs for other metrics
    const cleanValue = value.replace(/[$,%]/g, "");
    return parseFloat(cleanValue) || null;
  };

  const getValue = (
    snapshot: TokenDetails | TokenMetrics,
    metric: string
  ): string | null => {
    if (metric.startsWith("holderDistribution.")) {
      const key = metric.split(".")[1];
      return (
        (snapshot as TokenMetrics).holderDistribution?.[
          key as keyof HolderDistribution
        ] || null
      );
    }

    return (
      (
        (snapshot as TokenDetails)[metric as keyof TokenDetails] ||
        (snapshot as TokenMetrics)[metric as keyof TokenMetrics]
      )?.toString() || null
    );
  };

  const hasValidDataA = snapshotA.some((snapshot) => {
    const value = getValue(snapshot, metricA);
    return value !== null && value !== undefined && value !== "";
  });

  if (!hasValidDataA) {
    return null;
  }

  const hasValidDataB = snapshotB.some((snapshot) => {
    const value = getValue(snapshot, metricB);
    return value !== null && value !== undefined && value !== "";
  });

  if (!hasValidDataB) {
    return null;
  }

  const maxLength = Math.max(snapshotA.length, snapshotB.length);

  const dataA = Array.from({ length: maxLength }, (_, index) => {
    const value = index < snapshotA.length ? formatValue(getValue(snapshotA[index], metricA)) : null;
    return value !== null ? value : 0; // Fallback to 0 if value is null
  });
  
  const dataB = Array.from({ length: maxLength }, (_, index) => {
    const value = index < snapshotB.length ? formatValue(getValue(snapshotB[index], metricB)) : null;
    return value !== null ? value : 0; // Fallback to 0 if value is null
  });
  
  const chartPoints = dataA.map((xValue, index) => ({
    x: xValue, // Already a number
    y: dataB[index], // Already a number
  }));

  const chartData = {
    labels: [`${tickerA.toString()} ${labelA.toString()}`],
    datasets: [
      {
        label: `${tickerA.toString()} ${labelA.toString()}`,
        data: chartPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        type: "scatter" as const,
      },
      {
        label: "Regression Line", // Label for the line
        type: "line", // Explicitly define as a line
        data: [
          { x: Math.min(...dataA), y: Math.min(...dataB) },
          { x: Math.max(...dataA), y: Math.max(...dataB) },
        ], // Define start and end points for the line
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false, // Disable fill for the line
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
        text: `${labelA} vs ${labelB}`,
      },
      zoom: zoomOptions,
    },
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
      },
    },
  };

  const onResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    } else {
      console.warn("chartRef.current is null");
    }
  };

  const onZoomPluse = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.1);
    } else {
      console.warn("chartRef.current is null");
    }
  };

  const onZoomMinus = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.9);
    } else {
      console.warn("chartRef.current is null");
    }
  };

  return (
    <div className="w-full relative h-[300px] p-4 border rounded-lg">
      <div className="absolute top-4 right-4 space-x-2 flex items-center bg-white/20 p-4 py-2 rounded-full border border-white z-100">
        <button onClick={onResetZoom} className="text-[12px]">
          reset
        </button>

        <button onClick={onZoomMinus}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-minus"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <button onClick={onZoomPluse}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>

      {/* @ts-expect-error: I am not able to use line and scatter plot together, still trying to figure out how to fix this*/}
      <Scatter ref={chartRef} options={options} data={chartData} />
    </div>
  );
}
