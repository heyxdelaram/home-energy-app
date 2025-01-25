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

function ChartComponent({ chartData }) {
  if (chartData.labels.length === 0 || chartData.datasets.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <div className="bg-white rounded-xl p-6 col-span-4 lg:col-span-4">
      <h2>Report</h2>
      <Line data={chartData} />
    </div>
  );
}


export default ChartComponent;
