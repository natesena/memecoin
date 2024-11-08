import { Line } from "react-chartjs-2";
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
import { Token, TokenHistory } from "@/types/Token";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TokenHoldersProps {
  tokens: Token[];
}

const TokenHolders = ({ tokens }: TokenHoldersProps) => {
  // Get unique dates for x-axis
  const dates = [
    ...new Set(
      tokens.map((token) => new Date(token.createdAt).toLocaleDateString())
    ),
  ].sort();

  // Get unique token names
  const uniqueTokens = [...new Set(tokens.map((token) => token.name))];

  // Create datasets - one line per token
  const datasets = uniqueTokens.map((tokenName, index) => {
    const tokenData = tokens.filter((t) => t.name === tokenName);

    // Generate a unique color for each token
    const hue = (index * 137.5) % 360; // Golden angle approximation for good color distribution
    const color = `hsl(${hue}, 70%, 50%)`;

    return {
      label: `${tokenName} Holders`,
      data: tokenData.map((token) => ({
        x: new Date(token.createdAt).toLocaleDateString(),
        y: parseInt(token.holders),
      })),
      fill: false,
      borderColor: color,
      tension: 0.1,
    };
  });

  const data = {
    labels: dates,
    datasets: datasets,
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
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Holders",
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default TokenHolders;
