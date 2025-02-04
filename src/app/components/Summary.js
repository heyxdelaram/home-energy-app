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

    const analyzeReports = async () => {
      try {
        setLoading(true);
        setError("");

        // Filter reports matching the selected bill type, month, and year
        const filteredReports = fetchedReports.filter((report) => {
          const reportDate = new Date(report.date);
          return (
            report.bill_type === billType &&
            reportDate.getMonth() === month &&
            reportDate.getFullYear() === year
          );
        });

        if (filteredReports.length === 0) {
          console.warn("No reports found for the selected criteria.");
          setSummary("No reports available for the selected criteria.");
          setLoading(false);
          return;
        }

        // Clean up report text and ensure it's readable
        const reportTexts = filteredReports
          .map(
            (report) =>
              `Date: ${report.date}, Usage: ${report.usage}, Cost: ${report.cost}`
          )
          .join("\n");

        // If text is too long, truncate it to prevent token limit issues
        const MAX_LENGTH = 1000; // Example length limit
        const truncatedText = reportTexts.length > MAX_LENGTH
          ? reportTexts.substring(0, MAX_LENGTH)
          : reportTexts;

        // Build a prompt with report details
        const prompt = `Please summarize the following report data for bill type ${billType} in ${month + 1}/${year}:\n${truncatedText}`;

        const response = await fetch("/api/analyze-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
        setError(error.message || "Something went wrong while analyzing reports.");
      } finally {
        setLoading(false);
      }
    };

    analyzeReports();
  }, [selectedReportCriteria, fetchedReports, setSummary]);

  return (
    <div className="summary-message w-full">
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error-text">{error}</p>}
      <p>{summary}</p>
    </div>
  );
}
