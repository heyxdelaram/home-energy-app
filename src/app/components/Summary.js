"use client";

import { useEffect, useState } from "react";

export default function Summary({
  selectedReportCriteria,
  fetchedReports,
  setSummary,
  summary,
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

        const startDate = new Date(year, month - 2, 1);
        const endDate = new Date(year, month + 1, 0);

        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            report.bill_type === billType &&
            reportDate >= startDate &&
            reportDate <= endDate
          );
        });

        if (filteredReports.length === 0) {
          setSummary("No reports available for the selected criteria.");
          setLoading(false);
          return;
        }

        let totalUsage = 0;
        let totalCost = 0;
        console.log(filteredReports);

        filteredReports.forEach((report) => {
          totalUsage += report.usage || 0;
          totalCost += report.cost || 0;
        });

        const averageUsage = (totalUsage / filteredReports.length).toFixed(2);
        const averageCost = (totalCost / filteredReports.length).toFixed(2);

        let goalUsageExceededCount = filteredReports.filter(
          (report) => report.goal_usage && report.usage > report.goal_usage
        ).length;

        let generatedSummary = `In the past three months including ${
          month + 1
        }/${year}, for ${billType}, the total usage was ${totalUsage} units with a total cost of $${totalCost.toFixed(
          2
        )}. The average usage was ${averageUsage} units and the average cost was $${averageCost}. `;

        if (goalUsageExceededCount > 0) {
          generatedSummary += `The goal usage was exceeded on ${goalUsageExceededCount} occasion(s), so consider reviewing your usage habits.`;
        } else {
          generatedSummary += `The goal usage was not exceeded this month, great job!`;
        }

        setSummary(generatedSummary);
      } catch (error) {
        setError(
          error.message || "Something went wrong while analyzing reports."
        );
      } finally {
        setLoading(false);
      }
    };

    analyzeReports();
  }, [selectedReportCriteria, fetchedReports, setSummary]);

  return (
    <div className="summary-message w-full text-green-800 dark:text-green-600 font-semibold p-4">
      {loading && <p>Loading analysis...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {summary && <p>{summary}</p>}
    </div>
  );
}
