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

// Register required ChartJS components
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

/**
 * Dashboard Component
 *
 * This component renders the main dashboard view which includes:
 * - A sidebar for navigation.
 * - A header displaying user information.
 * - A modal for adding a new bill.
 * - A chart to display usage and cost trends.
 * - A report data component for displaying and editing report details.
 * - A summary of selected reports.
 * - A list of reports for quick navigation.
 *
 * It fetches user and report data from Supabase and updates state accordingly.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard() {
  // State for chart data used in the chart component.
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Usage", data: [] },
      { label: "Cost", data: [] },
    ],
  });

  // State to control the visibility of the modal for adding a new bill.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the bill form data.
  const [formData, setFormData] = useState({
    cost: "",
    usage: "",
    date: "",
    billType: "water",
  });

  // State for the authenticated user.
  const [user, setUser] = useState({});

  // State for storing fetched reports from Supabase.
  const [fetchedReports, setFetchedReports] = useState([]);

  // State for storing the most recent (last) report.
  const [lastReport, setLastReport] = useState({});

  // State to track if the report is in editing mode.
  const [isEditing, setIsEditing] = useState(false);

  // Holds the criteria for the selected report (bill type, month, year)
  const [selectedReportCriteria, setSelectedReportCriteria] = useState(null);

  // State for the summary message generated based on the report criteria.
  const [summary, setSummary] = useState("");

  /**
   * Adds a new bill by inserting the formData into the "bills" table.
   * On success, updates the fetched reports, resets the form, and closes the modal.
   */
  const handleAddBill = async () => {
    try {
      // Validate form data fields.
      if (
        !formData.billType ||
        !formData.cost ||
        !formData.usage ||
        !formData.date
      ) {
        alert("Please fill in all fields.");
        return;
      }

      // Insert new bill into the Supabase "bills" table.
      const { data, error } = await supabase
        .from("bills")
        .insert({
          bill_type: formData.billType,
          cost: parseFloat(formData.cost),
          usage: parseFloat(formData.usage),
          date: formData.date,
          user_id: user.id,
          goal_usage: 50,
        })
        .select();

      if (error) {
        console.error("Error saving bill:", error.message);
        alert("Failed to save the bill.");
      } else if (data && data.length > 0) {
        alert("Bill added successfully!");
        // Add the new bill to the beginning of the fetched reports array.
        setFetchedReports((prevReports) => [data[0], ...prevReports]);
        setLastReport(data[0]);
        setIsModalOpen(false);
        // Reset form data after a successful addition.
        setFormData({ billType: "", cost: "", usage: "", date: "" });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  /**
   * Fetches the user data and bills (reports) from Supabase when the component mounts.
   * - Retrieves the authenticated user.
   * - Fetches the most recent report and sets the form data accordingly.
   * - Fetches all reports for the user.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authenticated user.
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        setUser(userData.user);

        // Fetch the most recent report for the user.
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

        // Fetch all reports for the user.
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

  /**
   * Updates an existing report using the provided form data.
   * The report is updated in the Supabase "bills" table.
   * After the update, the local state is updated with the latest report data.
   *
   * @param {Object} formData - The form data containing cost, usage, date, and billType.
   */
  const handleSaveReport = useCallback(
    async (formData) => {
      try {
        // Validate form data fields.
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

        // Update the report in the Supabase "bills" table.
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
          // Fetch the updated report.
          const { data: updatedReport, error: fetchError } = await supabase
            .from("bills")
            .select("id, date, usage, cost, goal_usage, bill_type")
            .eq("id", lastReport.id);

          if (fetchError) {
            console.error("Error fetching updated report:", fetchError.message);
          } else {
            console.log("Updated Report Data:", updatedReport[0]);
            setLastReport(updatedReport[0]);

            // Refresh the full list of reports.
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

  /**
   * Enables editing mode for the current report.
   */
  const handleEditReport = () => {
    setIsEditing(true);
  };

  /**
   * Cancels the editing mode.
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  /**
   * Resets the form data to empty values.
   */
  const resetFormData = () => {
    setFormData({
      cost: "",
      usage: "",
      date: "",
      billType: "",
    });
  };

  /**
   * Handles the click on a report from the ReportsList.
   * Filters and sorts reports for the selected bill type and date range,
   * updates the form data with the most recent report, and configures chart data.
   *
   * @param {string} billType - The bill type of the selected report.
   * @param {Date} selectedDate - The date of the selected report.
   */
  const handleReportClick = (billType, selectedDate) => {
    // Determine month and year from the selected date.
    const month = selectedDate.getMonth(); // zero-indexed
    const year = selectedDate.getFullYear();

    // Set the criteria for report summary.
    setSelectedReportCriteria({ billType, month, year });

    // Filter reports based on the selected bill type and date range.
    const filteredReports =
      fetchedReports.filter((report) => {
        const reportDate = new Date(report.date);
        const reportMonth = reportDate.getMonth();
        const reportYear = reportDate.getFullYear();

        // Include reports for the last 3 months for this bill type.
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

    // Sort the filtered reports in ascending order (oldest first).
    const sortedReports = filteredReports.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (sortedReports.length > 0) {
      // Grab the most recent report (last element) for updating the form.
      const latestReport = sortedReports[sortedReports.length - 1];
      setFormData({
        cost: latestReport.cost.toString(),
        usage: latestReport.usage.toString(),
        date: latestReport.date,
        billType: latestReport.bill_type,
      });
    }

    // Prepare labels and data for the chart.
    const labels = sortedReports.map((report) =>
      new Date(report.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const usageData = sortedReports.map((report) => report.usage || 0);
    const costData = sortedReports.map((report) => report.cost || 0);
    const goalUsageData = new Array(sortedReports.length).fill(50);

    // Update the chart data state.
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
          borderColor: "#7F00FF",
          backgroundColor: "rgba(127, 0, 255, 0.2)",
          borderDash: [5, 5], // dashed line for visual distinction
        },
      ],
    });
  };

  return (
    <>
      {/* Modal for adding a new bill */}
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
      <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-white dark:bg-zinc-900">
        {/* Sidebar component for navigation */}
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          {/* Header component displaying user info */}
          <Header user={user} fetchedReports={fetchedReports} />
          <div className="grid text-black dark:text-gray-100 grid-cols-1 xl:grid-cols-6 lg:gap-8">
            {/* ReportData component for displaying and editing report details */}
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
            {/* ChartComponent for visualizing report trends */}
            <ChartComponent chartData={chartData} />
          </div>
          {/* Summary component showing an analysis of the selected reports */}
          <div className="text-green-800 font-semibold">
            <Summary
              selectedReportCriteria={selectedReportCriteria}
              fetchedReports={fetchedReports}
              setSummary={setSummary}
              summary={summary}
            />
          </div>
        </main>
        {/* ReportsList component for navigating through available reports */}
        <ReportsList
          setIsModalOpen={setIsModalOpen}
          reports={fetchedReports}
          onReportClick={handleReportClick}
        />
      </div>
    </>
  );
}
