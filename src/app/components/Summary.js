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
    // Only run analysis if a report has been selected.
    if (!selectedReportCriteria) {
      setSummary("");
      return;
    }

    const { billType, month, year } = selectedReportCriteria;

    const analyzeReports = async () => {
      try {
        setLoading(true);
        setError("");

        // Filter reports that match the selected bill type, month, and year
        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            report.bill_type === billType &&
            reportDate.getMonth() === month &&
            reportDate.getFullYear() === year
          );
        });

        console.log(
          "Filtered Reports:",
          JSON.stringify(filteredReports, null, 2)
        );

        if (filteredReports.length === 0) {
          console.warn("No reports found for the selected criteria.");
          setSummary("No reports available for the selected criteria.");
          setLoading(false);
          return;
        }

        // Create a prompt that can include the bill type and a human-readable month/year.
        const prompt = `Please analyze the following report data for bill type ${billType} in ${
          month + 1
        }/${year}:`;

        const response = await fetch("/api/analyze-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reports: filteredReports,
            prompt,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response Error:", errorText);
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();

        if (data?.summary) {
          setSummary(data.summary);
        } else {
          setError("Failed to retrieve a valid summary.");
        }
      } catch (error) {
        console.error("Error analyzing reports:", error);
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
    <div className="summary-message">
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error-text">{error}</p>}
      <p>{summary}</p>
    </div>
  );
}
