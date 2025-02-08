"use client";

import { useEffect, useState } from "react";

/**
 * Summary Component
 *
 * Analyzes the fetched reports based on the selected report criteria and generates a summary.
 * The summary includes total and average usage and cost, as well as whether the goal usage was exceeded.
 *
 * @param {Object} props - Component properties.
 * @param {Object|null} props.selectedReportCriteria - The criteria selected for the report analysis, containing:
 *    - {string} billType - The type of bill to analyze.
 *    - {number} month - The month (1-indexed) to base the analysis on.
 *    - {number} year - The year to base the analysis on.
 * @param {Array} props.fetchedReports - Array of report objects to be analyzed. Each report should have:
 *    - {string} date - The date of the report.
 *    - {string} bill_type - The bill type of the report.
 *    - {number} usage - The usage value (optional).
 *    - {number} cost - The cost value (optional).
 *    - {number} [goal_usage] - The goal usage value (optional).
 * @param {Function} props.setSummary - Function to update the summary message.
 * @param {string} props.summary - The current summary message.
 * @returns {JSX.Element} The rendered Summary component.
 */
export default function Summary({
  selectedReportCriteria,
  fetchedReports,
  setSummary,
  summary,
}) {
  // State to manage loading status during analysis
  const [loading, setLoading] = useState(false);
  // State to manage any error message that might occur during analysis
  const [error, setError] = useState("");

  useEffect(() => {
    // If no criteria is selected, reset the summary and exit early
    if (!selectedReportCriteria) {
      setSummary("");
      return;
    }

    // Destructure the necessary criteria values
    const { billType, month, year } = selectedReportCriteria;

    /**
     * Analyzes the fetched reports based on the provided criteria.
     * - Filters reports by the given bill type and within the past three months (including the selected month).
     * - Calculates total usage, total cost, average usage, and average cost.
     * - Determines if the goal usage was exceeded on any report.
     * - Generates a summary string and updates the summary state.
     */
    const analyzeReports = () => {
      try {
        setLoading(true);
        setError("");

        // Determine the start and end dates for the analysis:
        // Start date: two months prior to the selected month (month - 2) starting from day 1.
        // End date: end of the selected month (month + 1 gives last day of the selected month).
        const startDate = new Date(year, month - 2, 1);
        const endDate = new Date(year, month + 1, 0);

        // Filter reports that match the selected bill type and fall within the date range
        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            report.bill_type === billType &&
            reportDate >= startDate &&
            reportDate <= endDate
          );
        });

        // If no reports are found, update the summary accordingly and stop processing.
        if (filteredReports.length === 0) {
          setSummary("No reports available for the selected criteria.");
          setLoading(false);
          return;
        }

        // Calculate total usage and total cost from the filtered reports.
        let totalUsage = 0;
        let totalCost = 0;
        console.log(filteredReports);

        filteredReports.forEach((report) => {
          totalUsage += report.usage || 0;
          totalCost += report.cost || 0;
        });

        // Calculate averages; using toFixed(2) to format the numbers to two decimal places.
        const averageUsage = (totalUsage / filteredReports.length).toFixed(2);
        const averageCost = (totalCost / filteredReports.length).toFixed(2);

        // Count the number of reports where the actual usage exceeded the goal usage.
        let goalUsageExceededCount = filteredReports.filter(
          (report) => report.goal_usage && report.usage > report.goal_usage
        ).length;

        // Build the summary message with the calculated values.
        let generatedSummary = `In the past three months including ${month + 1}/${year}, for ${billType}, the total usage was ${totalUsage} units with a total cost of $${totalCost.toFixed(
          2
        )}. The average usage was ${averageUsage} units and the average cost was $${averageCost}. `;

        if (goalUsageExceededCount > 0) {
          generatedSummary += `The goal usage was exceeded on ${goalUsageExceededCount} occasion(s), so consider reviewing your usage habits.`;
        } else {
          generatedSummary += `The goal usage was not exceeded this month, great job!`;
        }

        // Update the summary state with the generated summary message.
        setSummary(generatedSummary);
      } catch (error) {
        // In case of an error, update the error state with a message.
        setError(
          error.message || "Something went wrong while analyzing reports."
        );
      } finally {
        // Always set loading to false when processing is complete.
        setLoading(false);
      }
    };

    // Call the analysis function whenever the selected criteria or fetched reports change.
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
