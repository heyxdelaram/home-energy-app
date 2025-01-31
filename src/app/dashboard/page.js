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
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Modal from "../components/Modal";
import Header from "../components/Header";
import ChartComponent from "../components/ChartComponent";
import ReportData from "../components/ReportData";
import ReportsList from "../components/ReportsList";
import OpenAI from "openai";
import Summary from "../components/Summary";

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
  const [isEditing, setIsEditing] = useState(false); // State to track if editing
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [summary, setSummary] = useState(""); // To hold the summary message

  const handleAddBill = async () => {
    try {
      // Validate form data
      if (
        !formData.billType ||
        !formData.cost ||
        !formData.usage ||
        !formData.date
      ) {
        alert("Please fill in all fields.");
        return;
      }

      // Save the new bill (example using Supabase)
      const { error } = await supabase.from("bills").insert({
        bill_type: formData.billType,
        cost: parseFloat(formData.cost),
        usage: parseFloat(formData.usage),
        date: formData.date,
        user_id: user.id, // Replace with actual user ID
      });

      if (error) {
        console.error("Error saving bill:", error.message);
        alert("Failed to save the bill.");
      } else {
        alert("Bill added successfully!");
        setIsModalOpen(false); // Close modal after saving
        setFormData({ billType: "", cost: "", usage: "", date: "" }); // Reset form
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        setUser(userData.user);

        // Fetch last report with ID
        const { data, error } = await supabase
          .from("bills")
          .select("id, date, usage, cost, goal_usage, bill_type")
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
          console.error(
            "Error fetching all reports:",
            allReports.error.message
          );
          return;
        } else {
          console.log("All Reports Data:", allReports.data);
          setFetchedReports([...allReports.data]);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      fetchedReports.length > 0 &&
      lastReport &&
      lastReport.bill_type &&
      lastReport.date
    ) {
      const filteredReports = fetchedReports.filter((report) => {
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
        const sortedReports = filteredReports.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB; // Sort ascending order by date
        });

        const labels = sortedReports.map((report) => {
          const date = new Date(report.date);
          return date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
        });

        const usageData = sortedReports.map((report) => report.usage || 0);
        const costData = sortedReports.map((report) => report.cost || 0);
        const goalUsageData = sortedReports.map(
          (report) => report.goal_usage || 0
        );

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
  }, [fetchedReports, lastReport]);

  const handleSaveReport = useCallback(
    async (formData) => {
      try {
        if (
          !formData.cost ||
          !formData.usage ||
          !formData.date ||
          !formData.billType
        ) {
          console.error("One or more form fields are empty.");
          return;
        }

        if (!lastReport.id) {
          console.error("Last report ID is undefined.");
          return;
        }

        // Update the report
        const { error } = await supabase
          .from("bills")
          .update({
            cost: parseFloat(formData.cost),
            usage: parseFloat(formData.usage),
            date: formData.date,
            bill_type: formData.billType,
          })
          .eq("id", lastReport.id);

        if (error) {
          console.error("Error updating report:", error.message);
        } else {
          console.log("Report updated successfully.");

          // Fetch the updated report
          const { data: updatedReport, error: fetchError } = await supabase
            .from("bills")
            .select("id, date, usage, cost, goal_usage, bill_type")
            .eq("id", lastReport.id);

          if (fetchError) {
            console.error("Error fetching updated report:", fetchError.message);
          } else {
            console.log("Updated Report Data:", updatedReport[0]);
            setLastReport(updatedReport[0]); // Update the last report state

            // Fetch all reports again to update chart data
            const allReports = await supabase
              .from("bills")
              .select("date, usage, cost, goal_usage, bill_type")
              .eq("user_id", user.id);

            if (allReports.error) {
              console.error(
                "Error fetching all reports:",
                allReports.error.message
              );
            } else {
              setFetchedReports([...allReports.data]);
            }

            setIsEditing(false); // Reset editing state
          }
        }
      } catch (error) {
        console.error("Error updating report:", error.message);
      }
    },
    [lastReport, user]
  );

  const handleEditReport = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const resetFormData = () => {
    setFormData({
      cost: "",
      usage: "",
      date: "",
      billType: "",
    });
  };
  const handleReportClick = (billType, selectedDate) => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // Filter reports for the last 3 months of the selected bill type
    const filteredReports = fetchedReports.filter((report) => {
      const reportDate = new Date(report.date);
      const reportMonth = reportDate.getMonth();
      const reportYear = reportDate.getFullYear();

      // Check if the report falls within the last 3 months
      const isSameYear =
        reportYear === selectedYear &&
        reportMonth <= selectedMonth &&
        reportMonth >= selectedMonth - 2;
      const isPreviousYear =
        reportYear === selectedYear - 1 &&
        selectedMonth < 2 &&
        reportMonth >= 12 - (2 - selectedMonth);

      return report.bill_type === billType && (isSameYear || isPreviousYear);
    });
    // If there are filtered reports, set form data to the most recent one
    if (filteredReports.length > 0) {
      const latestReport = filteredReports[0]; // Assuming you want to autofill with the latest one
      setFormData({
        cost: latestReport.cost.toString(),
        usage: latestReport.usage.toString(),
        date: latestReport.date,
        billType: latestReport.bill_type,
      });
    }
    // Update chart data
    const labels = filteredReports.map((report) =>
      new Date(report.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );

    const usageData = filteredReports.map((report) => report.usage || 0);
    const costData = filteredReports.map((report) => report.cost || 0);

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
      ],
    });
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          existingBills={fetchedReports}
          addBill={handleAddBill}
        />
      )}
      <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Header */}
          <Header user={user} />

          <div className="grid text-black grid-cols-1 xl:grid-cols-6 lg:gap-8">
            {/* Report Data Display Section */}
            <ReportData
              formData={formData}
              setFormData={setFormData}
              resetFormData={resetFormData}
              onSave={handleSaveReport}
              isEditing={isEditing}
              onEdit={handleEditReport}
              onCancelEdit={handleCancelEdit}
            />
            {/* Chart Section */}
            <ChartComponent chartData={chartData} />
            <Summary
              selectedMonth={selectedMonth}
              fetchedReports={fetchedReports}
              lastReport={lastReport}
              setSummary={setSummary}
              summary={summary}
            />
          </div>
        </main>
        {/* Reports Section */}

        <ReportsList
          setIsModalOpen={setIsModalOpen}
          reports={fetchedReports}
          user={user} // fetchedReports is an array of reports from Supabase
          onReportClick={handleReportClick}
        />
        {/**TODO fix connection */}
      </div>
    </>
  );
}
