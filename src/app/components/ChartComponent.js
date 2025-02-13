"use client";

// Import necessary components and modules from chart.js
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
// Import the Line chart component from react-chartjs-2
import { Line } from "react-chartjs-2";

// Register the necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * ChartComponent is a React component that renders a Line chart using Chart.js.
 * 
 * @param {Object} chartData - The data object used to render the chart. It should contain labels and datasets.
 * @returns {JSX.Element} - The rendered chart or a message indicating no data available.
 */
function ChartComponent({ chartData }) {
  // Check if there is no data available for the chart
  if (chartData.labels.length === 0 || chartData.datasets.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <div className="bg-white rounded-xl p-6 col-span-4 lg:col-span-4 lg:dark:bg-zinc-800 dark:bg-zinc-900">
      {/* Heading for the chart */}
      <h2>Report</h2>
      {/* Render the Line chart with the provided chart data */}
      <Line data={chartData} />
    </div>
  );
}

export default ChartComponent;
