"use client";

import { useEffect, useState } from "react";

export default function Summary({
  selectedMonth,
  fetchedReports,
  lastReport,
  setSummary,
  summary,
}) {
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // To handle errors

  useEffect(() => {
    const analyzeReports = async (selectedMonth) => {
      try {
        // Set loading state before sending the request
        setLoading(true);
        setError(""); // Reset error message on new request

        // Filter reports for the selected month
        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            reportDate.getMonth() === selectedMonth &&
            reportDate.getFullYear() === new Date().getFullYear()
          );
        });

        console.log(
          "Filtered Reports:",
          JSON.stringify(filteredReports, null, 2)
        ); // Log filtered reports

        const goalUsage = lastReport.goal_usage || 0;

        // Optional: add a prompt string here if needed
        const prompt =
          "Please analyze the following reports for usage analysis.";

        // Handle case where no reports are found
        if (filteredReports.length === 0) {
          console.warn("No reports found for the selected month.");
          setSummary("No reports available for the selected month.");
          setLoading(false); // Stop loading when done
          return; // Exit early if no valid reports
        }

        // Send data to backend for analysis
        const response = await fetch("../api/analyze-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reports: filteredReports,
            goalUsage,
            prompt: prompt, // Add the missing prompt here
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response Error:", errorText);
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();

        if (data?.summary) {
          setSummary(data.summary); // Display summary in your UI
        } else {
          setError("Failed to retrieve a valid summary.");
        }
      } catch (error) {
        console.error("Error analyzing reports:", error);
        setError(
          error.message || "Something went wrong while analyzing reports."
        );
      } finally {
        setLoading(false); // Stop loading after analysis
      }
    };

    analyzeReports(selectedMonth);
  }, [selectedMonth, fetchedReports, lastReport.goal_usage, setSummary]);

  return (
    <div className="summary-message">
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error-text">{error}</p>}{" "}
      {/* Display error message */}
      <p>{summary}</p>
    </div>
  );
}
