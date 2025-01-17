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

import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Dashboard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Expected Consumption",
        data: [70, 60, 90, 85, 60],
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#2196F3",
      },
      {
        label: "Consumed",
        data: [65, 59, 80, 81, 56],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#4CAF50",
      },
    ],
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      {!isOpen && (
        <nav className="bg-white w-full lg:hidden p-2 text-gray-800 fixed z-50">
          <button onClick={() => setIsOpen(!isOpen)}>☰</button>
        </nav>
      )}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } `}
        onClick={() => setIsOpen(false)} // Close when clicking outside
      ></div>
      <div
        className={`fixed top-0 left-0 w-64 bg-gray-100 font-semibold text-zinc-900 p-6 flex flex-col justify-between z-50 transform transition-transform rounded-xl m-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full "
        } lg:translate-x-0 lg:static lg:w-48`}
      >
        <div className="space-y-2">
          <a
            href="/dashboard"
            className="block text-lg font-medium hover:text-green-400"
          >
            Dashboard
          </a>
          <a href="#" className="block text-lg hover:text-green-400">
            Reports
          </a>
        </div>
        {/* Footer Links */}
        <div className="space-y-2">
          <a href="#" className="block text-lg hover:text-gray-400">
            Settings
          </a>
          <a href="#" className="block text-lg hover:text-gray-400">
            Help
          </a>
          <a href="#" className="block text-lg text-red-400 hover:text-red-300">
            Log Out
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <header className="">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-700">
                Hello, Margaret
              </h1>
              <p className="text-gray-600">Track your energy consumption</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-100 px-4 py-2 rounded-full shadow-sm text-sm text-black">
                {new Date().toLocaleDateString()}
              </button>
            </div>
          </div>
          <div className="bg-gray-100 text-sm font-semibold text-gray-500 p-2 rounded-full mt-4">
            <p>⚠️ You have 3 unassigned monthly reports.</p>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid text-black grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Monthly Consumption */}

          {/* Filters Section */}
          <div className="bg-gray-100 rounded-xl p-6 col-span-2">
            <h3 className="text-lg font-bold mb-4">Filter Data</h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="utility"
                  className="block text-sm font-medium text-gray-600"
                >
                  Select Utility
                </label>
                <select
                  id="utility"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Water</option>
                  <option>Gas</option>
                  <option>Electricity</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-600"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-600"
                >
                  Time
                </label>
                <select
                  id="time"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>8:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 4:00 PM</option>
                  <option>4:00 PM - 8:00 PM</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-600"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter location"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </form>
          </div>
          <div className="bg-white rounded-xl p-6 col-span-4 lg:col-span-4">
            <h2>Report</h2>
            <Line data={data} />
          </div>
        </div>
      </main>
      {/* Reports Section */}
      <div className="bg-gray-100 text-black rounded-xl m-4 p-6 w-1/6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Reports</h3>
          <button className="text-green-500 hover:bg-green-100 p-2 rounded-xl">
            <FaPlus size={18} />
          </button>
        </div>
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-600"
          >
            Year
          </label>
          <select
            id="year"
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl text-gray-700 hover:bg-gray-200">
              <span>January</span>
              <span>11:22 PM</span>
            </button>
            <button className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl text-gray-700 hover:bg-gray-200">
              <span>March</span>
              <span>11:22 PM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
