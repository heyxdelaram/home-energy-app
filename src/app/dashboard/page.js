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
import Summary from "../components/Summary";

export default function Dashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Usage", data: [] },
      { label: "Cost", data: [] },
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cost: "",
    usage: "",
    date: "",
    billType: "water",
  });
  const [user, setUser] = useState({});
  const [fetchedReports, setFetchedReports] = useState([]);
  const [lastReport, setLastReport] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  // Holds the criteria for the selected report (bill type, month, year)
  const [selectedReportCriteria, setSelectedReportCriteria] = useState(null);
  const [summary, setSummary] = useState("");

  const handleAddBill = async () => {
    try {
      if (
        !formData.billType ||
        !formData.cost ||
        !formData.usage ||
        !formData.date
      ) {
        alert("Please fill in all fields.");
        return;
      }

      const { data, error } = await supabase
        .from("bills")
        .insert({
          bill_type: formData.billType,
          cost: parseFloat(formData.cost),
          usage: parseFloat(formData.usage),
          date: formData.date,
          user_id: user.id,
        })
        .select();

      if (error) {
        console.error("Error saving bill:", error.message);
        alert("Failed to save the bill.");
      } else if (data && data.length > 0) {
        alert("Bill added successfully!");
        setFetchedReports((prevReports) => [data[0], ...prevReports]);
        setLastReport(data[0]);
        setIsModalOpen(false);
        setFormData({ billType: "", cost: "", usage: "", date: "" }); // Reset form data
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        setUser(userData.user);

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

        const allReports = await supabase
          .from("bills")
          .select("id, date, usage, cost, goal_usage, bill_type")
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
          const { data: updatedReport, error: fetchError } = await supabase
            .from("bills")
            .select("id, date, usage, cost, goal_usage, bill_type")
            .eq("id", lastReport.id);

          if (fetchError) {
            console.error("Error fetching updated report:", fetchError.message);
          } else {
            console.log("Updated Report Data:", updatedReport[0]);
            setLastReport(updatedReport[0]);

            const allReports = await supabase
              .from("bills")
              .select("id, date, usage, cost, goal_usage, bill_type")
              .eq("user_id", user.id);

            if (allReports.error) {
              console.error(
                "Error fetching all reports:",
                allReports.error.message
              );
            } else {
              setFetchedReports([...allReports.data]);
            }

            setIsEditing(false);
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

  // --- UPDATED: Sort the filtered reports in ascending order ---
  const handleReportClick = (billType, selectedDate) => {
    const month = selectedDate.getMonth(); // zero-indexed
    const year = selectedDate.getFullYear();

    setSelectedReportCriteria({ billType, month, year });

    const filteredReports =
      fetchedReports.filter((report) => {
        const reportDate = new Date(report.date);
        const reportMonth = reportDate.getMonth();
        const reportYear = reportDate.getFullYear();

        // Example: include reports for the last 3 months for this bill type
        const isSameYear =
          reportYear === year &&
          reportMonth <= month &&
          reportMonth >= month - 2;
        const isPreviousYear =
          reportYear === year - 1 &&
          month < 2 &&
          reportMonth >= 12 - (2 - month);

        return report.bill_type === billType && (isSameYear || isPreviousYear);
      }) || [];

    // Sort the filtered reports in ascending order (oldest first)
    const sortedReports = filteredReports.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (sortedReports.length > 0) {
      // Grab the most recent report (last element) for updating the form
      const latestReport = sortedReports[sortedReports.length - 1];
      setFormData({
        cost: latestReport.cost.toString(),
        usage: latestReport.usage.toString(),
        date: latestReport.date,
        billType: latestReport.bill_type,
      });
    }

    const labels = sortedReports.map((report) =>
      new Date(report.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const usageData = sortedReports.map((report) => report.usage || 0);
    const costData = sortedReports.map((report) => report.cost || 0);

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
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          addBill={handleAddBill}
          existingBills={fetchedReports}
        />
      )}
      <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-white">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <Header user={user} />
          <div className="grid text-black grid-cols-1 xl:grid-cols-6 lg:gap-8">
            <ReportData
              formData={formData}
              setFormData={setFormData}
              resetFormData={resetFormData}
              onSave={handleSaveReport}
              isEditing={isEditing}
              onEdit={handleEditReport}
              onCancelEdit={handleCancelEdit}
              handleReportClick={handleReportClick}
            />
            <ChartComponent chartData={chartData} />
          </div>
          <div className="text-green-800 font-semibold">
            <Summary
              selectedReportCriteria={selectedReportCriteria}
              fetchedReports={fetchedReports}
              setSummary={setSummary}
              summary={summary}
              chartData={chartData}
            />
          </div>
        </main>
        <ReportsList
          setIsModalOpen={setIsModalOpen}
          reports={fetchedReports}
          onReportClick={handleReportClick}
        />
      </div>
    </>
  );
}
