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
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
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
    mode: "x"
  },
  zoom: {
    wheel: {
      enabled: true
    },
    pinch: {
      enabled: true
    },
    mode: "x"
  }
};


export default function MultiChart({
  snapshotA,
  snapshotB,
  metricA,
  metricB,
  labelA,
  tickerA,
  labelB,
  tickerB,
}: MetricsChartProps) {
  const chartRef = useRef<any | null>(null);


  const formatValue = (value: string | null | undefined) => {
    if (!value) return null;
    
    // Remove currency symbol, commas, and percentage signs for other metrics
    const cleanValue = value.replace(/[$,%]/g, "");
    return parseFloat(cleanValue) || null;
  };

  const getValue = (snapshot: TokenDetails | TokenMetrics, metric: string): string | null => {
    if (metric.startsWith('holderDistribution.')) {
      const key = metric.split('.')[1];
      return (snapshot as TokenMetrics).holderDistribution?.[key as keyof HolderDistribution] || null;
    }
    
    return ((snapshot as TokenDetails)[metric as keyof TokenDetails] || 
            (snapshot as TokenMetrics)[metric as keyof TokenMetrics])?.toString() || null;
  };

  const hasValidDataA = snapshotA.some(snapshot => {
    const value = getValue(snapshot, metricA);
    return value !== null && value !== undefined && value !== '';
  });

  if (!hasValidDataA) {
    return null;
  }

  const hasValidDataB = snapshotB.some(snapshot => {
    const value = getValue(snapshot, metricB);
    return value !== null && value !== undefined && value !== '';
  });

  if (!hasValidDataB) {
    return null;
  }

  const labelsA = snapshotA.map((snapshot) => 
    new Date(snapshot.createdAt).toLocaleDateString()
  );
  
  const labelsB = snapshotB.map((snapshot) => 
    new Date(snapshot.createdAt).toLocaleDateString()
  );

  const chartData = {
    labels: [...labelsA, ...labelsB],
    datasets: [
      {
        label: `${tickerA} ${labelA}`,
        data: snapshotA.map((snapshot) =>
          formatValue(getValue(snapshot, metricA))
        ),
        borderColor: "white",
        backgroundColor: "white",
        tension: 0.1,
      },
      {
        label: `${tickerB} ${labelB}`,
        data: snapshotB.map((snapshot) =>
          formatValue(getValue(snapshot, metricB))
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
        text: `${tickerA} vs ${tickerB}`,
      },
      zoom: zoomOptions
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
            callback: function (tickValue: number | string) {
                const value = Number(tickValue);
            
                // Format metricA
                let formattedMetricA = '';
                if (metricA.startsWith('holderDistribution.') || metricA === "holdersToOpenAccountsRatio") {
                    formattedMetricA = value.toLocaleString() + "%";
                } else if (metricA === "hhi") {
                    formattedMetricA = value.toLocaleString();
                } else if (metricA === "medianHolder") {
                    formattedMetricA = "#" + value.toLocaleString();
                } else if (
                    metricA === "marketCap" ||
                    metricA === "marketCapPerHolder" ||
                    metricA === "marketCapPerHolderOver10"
                ) {
                    formattedMetricA = "$" + value.toLocaleString();
                } else {
                    formattedMetricA = value.toLocaleString();
                }
            
                // Format metricB
                let formattedMetricB = '';
                if (metricB.startsWith('holderDistribution.') || metricB === "holdersToOpenAccountsRatio") {
                    formattedMetricB = value.toLocaleString() + "%";
                } else if (metricB === "hhi") {
                    formattedMetricB = value.toLocaleString();
                } else if (metricB === "medianHolder") {
                    formattedMetricB = "#" + value.toLocaleString();
                } else if (
                    metricB === "marketCap" ||
                    metricB === "marketCapPerHolder" ||
                    metricB === "marketCapPerHolderOver10"
                ) {
                    formattedMetricB = "$" + value.toLocaleString();
                } else {
                    formattedMetricB = value.toLocaleString();
                }
            
                // Return both metrics together
                return `${formattedMetricA} / ${formattedMetricB}`;
            },
            
        },
      },
    },
  };


  const onResetZoom = () => {
    chartRef.current.resetZoom();
  };

  const onZoomPluse = () => {
    chartRef.current.zoom(1.1);
  };

  const onZoomMinus = () => {
    chartRef.current.zoom(0.9);
  };

  const onPanPluse = () => {
    chartRef.current.pan({ x: 100 }, undefined, "default");
  };

  const onPanMinus = () => {
    chartRef.current.pan({ x: -100 }, undefined, "default");
  };

  return (
    <div className="w-full h-[300px] p-4 border rounded-lg">
      <Line ref={chartRef} options={options} data={chartData} />
      <button onClick={onResetZoom}>zoom reset</button>
      <button onClick={onZoomPluse}>zoom +10%</button>
      <button onClick={onZoomMinus}>zoom -10%</button>
      <button onClick={onPanPluse}>pan +100px</button>
      <button onClick={onPanMinus}>pan -100px</button>
    </div>
  );
}
