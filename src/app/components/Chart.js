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

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"], // "category" scale data
    datasets: [
      {
        label: "Monthly Consumption",
        data: [65, 59, 80, 81, 56],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Energy Consumption</h2>
      <Line data={data} />
    </div>
  );
}
