"use client"

import { useEffect } from "react";

export default function Summary({selectedMonth, fetchedReports, lastReport, setSummary, summary}){
    
    useEffect(() => {
    const analyzeReports = async (selectedMonth) => {
        try {
          // Filter reports for the selected month
          const filteredReports = fetchedReports.filter((report) => {
            const reportDate = new Date(report.date);
            return reportDate.getMonth() === selectedMonth && reportDate.getFullYear() === new Date().getFullYear();
          });

      
          const goalUsage = lastReport.goal_usage || 0;

          console.log(`filtered reports ${filteredReports}`)
          // Send data to backend for analysis
          const response = await fetch("../api/analyze-reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reports: filteredReports, goalUsage }),
          });

          console.log(`response ${response}`)
      
          if (!response.ok) {
            throw new Error("Failed to fetch analysis");
          }
      
          const data = await response.json();
          setSummary(data.summary); // Display summary in your UI
        } catch (error) {
          console.error("Error analyzing reports:", error);
        }
      };
      
        analyzeReports(selectedMonth);
      }, [selectedMonth, fetchedReports, lastReport.goal_usage, setSummary]);
      
      return(
        <div className="summary-message">
  <p>{summary} </p>
</div>
      );
}