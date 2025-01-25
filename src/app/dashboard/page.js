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
  const [user, setUser] = useState({});
  const [existingBills, setExistingBills] = useState([]);
  const [fetchedReports, setFetchedReports] = useState([]);
  const [lastReport, setLastReport] = useState({}); // State to hold the last report

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }
      
      setUser(userData.user);
      
      const { data, error } = await supabase
      .from("bills")
      .select("date, usage, cost, goal_usage, bill_type")
      .eq("user_id", userData.user.id)
      .order("date", { ascending: false })
      .limit(1);
      
      if (error) {
        console.error("Error fetching last report:", error.message);
        return;
      } else if (data && data.length > 0) {
        const lastReportData = data[0];
        setLastReport(lastReportData);
        setFormData({
          cost: lastReportData.cost.toString(),
          usage: lastReportData.usage.toString(),
          date: lastReportData.date,
          billType: lastReportData.bill_type,
        });
      } else {
        console.log("No last report found.");
      }
      
      // Fetch all reports for chart data
      const allReports = await supabase
      .from("bills")
      .select("date, usage, cost, goal_usage, bill_type")
      .eq("user_id", userData.user.id);
      
      if (allReports.error) {
        console.error("Error fetching all reports:", allReports.error.message);
        return;
      }
      
      setFetchedReports(allReports.data || []);
      
      console.log("Fetched Reports:", fetchedReports);
      console.log("Last Report:", lastReport);

      if (lastReport && lastReport.bill_type && lastReport.date) {
        const filteredReports = allReports.data.filter((report) => {
          const reportDate = new Date(report.date);
          const lastReportDate = new Date(lastReport.date);
          const lastReportMonth = lastReportDate.getMonth();
          const lastReportYear = lastReportDate.getFullYear();
          const reportMonth = reportDate.getMonth();
          const reportYear = reportDate.getFullYear();

          // Filter for the last three months of the same bill type
          if (report.bill_type === lastReport.bill_type) {
            if (
              reportYear === lastReportYear &&
              reportMonth >= lastReportMonth - 3 &&
              reportMonth <= lastReportMonth
            ) {
              return true;
            } else if (
              reportYear === lastReportYear - 1 &&
              reportMonth >= 9 &&
              reportMonth <= 11
            ) {
              return true;
            }
          }
          return false;
        });

        if (filteredReports.length > 0) {
          const labels = filteredReports.map((report) => {
            const date = new Date(report.date);
            return date.toLocaleString("default", { month: "short", year: "numeric" });
          });

          const usageData = filteredReports.map((report) => report.usage || 0);
          const costData = filteredReports.map((report) => report.cost || 0);
          const goalUsageData = filteredReports.map((report) => report.goal_usage || 0);

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
        }
      }
    };

    fetchData();
  }, []);

  const resetFormData = () => {
    setFormData({
      cost: "",
      usage: "",
      date: "",
      billType: "",
    });
  };

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
            <ChartComponent chartData={chartData} />
          </div>
        </main>
        {/* Reports Section */}
        <ReportsList
  setIsModalOpen={setIsModalOpen}
  reports={fetchedReports}
  user={user} // fetchedReports is an array of reports from Supabase
/>

      </div>
    </>
  );
}
