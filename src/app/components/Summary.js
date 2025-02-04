"use client";

import { useEffect, useState } from "react";

export default function Summary({
  selectedReportCriteria,
  fetchedReports,
  setSummary,
  summary
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedReportCriteria) {
      setSummary("");
      return;
    }

    const { billType, month, year } = selectedReportCriteria;

    const analyzeReports = () => {
      try {
        setLoading(true);
        setError("");

        // Get the start date for filtering (3 months back)
        const startDate = new Date(year, month - 2, 1); // Start from two months before
        const endDate = new Date(year, month + 1, 0); // End of the selected month

        // Filter reports matching the selected bill type and date range
        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            report.bill_type === billType &&
            reportDate >= startDate &&
            reportDate <= endDate
          );
        });

        if (filteredReports.length === 0) {
          console.warn("No reports found for the selected criteria.");
          setSummary("No reports available for the selected criteria.");
          setLoading(false);
          return;
        }

        // Analyze the filtered reports
        let totalUsage = 0;
        let totalCost = 0;

        filteredReports.forEach((report) => {
          totalUsage += report.usage || 0;
          totalCost += report.cost || 0;
        });

        const averageUsage = (totalUsage / filteredReports.length).toFixed(2);
        const averageCost = (totalCost / filteredReports.length).toFixed(2);

        // Generate a meaningful summary
        let generatedSummary = `In ${month + 1}/${year}, for ${billType}:\n`;
        generatedSummary += `Total Usage: ${totalUsage} units\n`;
        generatedSummary += `Total Cost: $${totalCost.toFixed(2)}\n`;
        generatedSummary += `Average Usage: ${averageUsage} units\n`;
        generatedSummary += `Average Cost: $${averageCost}\n`;

        // Check if goal usage was exceeded
        let goalUsageExceededCount = filteredReports.filter(report => report.goal_usage && report.usage > report.goal_usage).length;

        if (goalUsageExceededCount > 0) {
          generatedSummary += `Warning: The goal usage was exceeded on ${goalUsageExceededCount} occasion(s).\n`;
          generatedSummary += `Consider reviewing your usage habits to avoid higher costs.\n`;
        } else {
          generatedSummary += `Good job! The goal usage was not exceeded this month.\n`;
        }

        setSummary(generatedSummary);
      } catch (error) {
        console.error("Error analyzing reports:", error);
        setError(error.message || "Something went wrong while analyzing reports.");
      } finally {
        setLoading(false);
      }
    };

    analyzeReports();
  }, [selectedReportCriteria, fetchedReports, setSummary]);

  return (
    <div className="summary-message w-full text-green-800 font-semibold ">
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error-text">{error}</p>}
      <pre>{summary}</pre>
    </div>
  );
}
