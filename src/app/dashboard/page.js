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
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Modal from "../components/Modal";
import Header from "../components/Header";
import ChartComponent from "../components/ChartComponent";
import ReportData from "../components/ReportData";
import ReportsList from "../components/ReportsList";

export default function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cost: "",
    usage: "",
    date: "",
    billType: "water",
  });
  const user = supabase.auth.getUser();
  const [existingBills, setExistingBills] = useState([]);

  const addBill = async () => {
    const { cost, usage, date, billType } = formData;

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return;
    }

    const { data, error } = await supabase.from("bills").insert([
      {
        cost: parseFloat(cost),
        usage: parseFloat(usage),
        date,
        bill_type: billType, // Ensure this matches your database column name
        user_id: user.id, // Add the user's ID
      },
    ]);

    if (error) {
      console.error("Error adding bill:", error.message);
    } else {
      console.log("Bill added successfully:", data);
      setIsModalOpen(false); // Close the modal
      setFormData({ cost: "", usage: "", date: "", billType: "" }); // Reset form
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      cost: "",
      usage: "",
      date: "",
      billType: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("date, usage, cost, goal_usage, bill_type")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      console.log("Raw fetched data:", data);

      if (!data || data.length === 0) {
        console.warn("No data found or empty response from Supabase.");
        return;
      }

      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });
      const filteredData = data.filter((item) => {
        if (!item.date) {
          console.warn("Skipping item with missing date:", item);
          return false;
        }

        const itemMonth = new Date(item.date).toLocaleString("default", {
          month: "short",
        });
        return itemMonth === currentMonth;
      });

      console.log("Filtered data for the current month:", filteredData);

      const billsOfMonth = filteredData.map((item) => item.bill_type); // Extract bill_type values
      const uniqueBillsOfMonth = [...new Set(billsOfMonth)]; // Ensure uniqueness

      console.log("Unique bills of the month:", uniqueBillsOfMonth);

      // Update `existingBills` state
      setExistingBills(uniqueBillsOfMonth);

      const formattedData = filteredData.map((item) => {
        const month = new Date(item.date).toLocaleString("default", {
          month: "short",
        });
        return { ...item, month };
      });
      // Prepare chart data
      const labels = [...new Set(formattedData.map((item) => item.month))];
      const usageData = formattedData.map((item) => item.usage || 0);
      const costData = formattedData.map((item) => item.cost || 0);
      const goalUsageData = formattedData.map((item) => item.goal_usage || 0);

      console.log("Labels:", labels);
      console.log("Usage Data:", usageData);
      console.log("Cost Data:", costData);
      console.log("Goal Usage Data:", goalUsageData);

      setChartData({
        labels,
        datasets: [
          {
            label: "Usage",
            data: usageData,
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
          },
          {
            label: "Cost",
            data: costData,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
          },
          {
            label: "Goal Usage",
            data: goalUsageData,
            borderColor: "#FF9800",
            backgroundColor: "rgba(255, 152, 0, 0.2)",
          },
        ],
      });
    };

    fetchData();
  }, []);
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
    <>
      {/**Modal**/}
      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          formData={formData}
          addBill={addBill}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          existingBills={existingBills}
        />
      )}
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Header */}
          <Header user={user} />

          <div className="grid text-black grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Report Data Display Section */}
            <ReportData
              formData={formData}
              setFormData={setFormData}
              resetFormData={resetFormData}
            />
            {/* Chart Section */}
            <ChartComponent chartData={data} />
          </div>
        </main>
        {/* Reports Section */}
        <ReportsList setIsModalOpen={setIsModalOpen} />
      </div>
    </>
  );
}
