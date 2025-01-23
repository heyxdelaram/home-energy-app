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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        .select("month, usage, cost, goal_usage")
        .order("month", { ascending: true });

      if (error) console.log("Error fetching data: ", error);
      else {
        const labels = [];
        const usageData = [];
        const costData = [];
        const goalUsageData = [];

        data.forEach((item) => {
          if (!labels.includes(item.month)) {
            labels.push(item.month);
            usageData.push(item.usage);
            costData.push(item.cost);
            goalUsageData.push(item.goal_usage);
          }
        });
        setChartData({
          labels: labels,
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
      }
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
          handleInputChange={handleInputChange}
          addBill={addBill}
          setIsModalOpen={setIsModalOpen}
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
            <ReportData />

            {/* Chart Section */}
            <ChartComponent chartData={chartData} />
          </div>
        </main>
        {/* Reports Section */}
        <ReportsList setIsModalOpen={setIsModalOpen} />
      </div>
    </>
  );
}
