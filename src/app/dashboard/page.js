"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { supabase } from "../../../lib/supabaseClient";
import { data } from "autoprefixer";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [expectedData, setExpectedData] = useState([]);

  const fetchData = async () => {
    const { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .order("month", { ascending: true });

    if (error) console.error(error);
    else {
      setMonthlyData(bills.map((bill) => bill.usage));
      setExpectedData(bills.map((bill) => bill.expected));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Usage",
        data: monthlyData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Expected Usage",
        data: expectedData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header>
        <h1>Hello, Matthew</h1>
        <p>Jan 25</p>
      </header>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Monthly Consumption</h2>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [chartData.datasets[0]],
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Expected Consumption</h2>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [chartData.datasets[1]],
            }}
          />
        </div>
      </div>
    </div>
  );
}
