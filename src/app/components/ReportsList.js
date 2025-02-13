import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

/**
 * ReportsList Component
 *
 * Displays a list of reports grouped by month for a selected year.
 * Allows the user to select a year and add a new report via a modal.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.setIsModalOpen - Function to control the modal's open state.
 * @param {Array} props.reports - Array of report objects. Each report should have at least a `date` and `bill_type` property.
 * @param {Function} props.onReportClick - Callback function when a report is clicked. Receives the report's bill type and date.
 * @returns {JSX.Element} The rendered ReportsList component.
 */
const ReportsList = ({ setIsModalOpen, reports, onReportClick }) => {
  // State for the selected year, defaults to the current year.
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  /**
   * Filters and groups reports by month for the selected year.
   * - Filters reports to only include those with a date matching the selected year.
   * - Groups the filtered reports by month.
   */
  const groupedReports = reports
    .filter((report) => {
      const reportYear = new Date(report.date).getFullYear();
      // Compare report year with the selected year (converted to number).
      return reportYear === parseInt(selectedYear);
    })
    .reduce((acc, report) => {
      // Get the full month name (e.g., "January", "February").
      const month = new Date(report.date).toLocaleString("default", {
        month: "long",
      });
      // Initialize the month group if it doesn't exist.
      if (!acc[month]) acc[month] = [];
      // Add the report to the respective month group.
      acc[month].push(report);
      return acc;
    }, {});

  return (
    <div className="bg-gray-100 text-black dark:bg-zinc-800 dark:text-zinc-200 rounded-xl lg:m-4 p-6 lg:w-1/6 m-8 flex flex-col ">
      {/* Header section with title and add button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Reports</h3>
        {/* Button to open the modal for adding a new report */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-green-500 hover:bg-green-100 hover:dark:bg-green-800 p-2 rounded-xl"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {/* Year selector section */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="year"
          className="block w-full text-sm font-semibold dark:text-zinc-300 text-gray-600 mb-2"
        >
          Select Year
        </label>
        <select
          id="year"
          name="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full mb-4 p-4 border border-gray-300 dark:border-zinc-800 bg-black rounded-xl focus:outline-none text-white text-sm focus:ring-2 focus:ring-green-500"
        >
          {/* Year options */}
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Reports list section */}
      <div className="flex-1 overflow-y-auto space-y-4 text-white p-2">
        {Object.keys(groupedReports).length === 0 ? (
          // Display message if there are no reports for the selected year.
          <p className="text-center text-gray-500">No reports available</p>
        ) : (
          // Iterate over each month group in the groupedReports object.
          Object.entries(groupedReports).map(([month, reports]) => (
            <div key={month} className="mb-4">
              {/* Month header */}
              <h4 className="text-md font-semibold text-gray-800 dark:text-zinc-400 mb-2">
                {month}
              </h4>
              {/* List of reports for the month */}
              {reports.map((report, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between my-2 p-4 bg-green-600 rounded-xl hover:bg-green-800"
                  // Calls onReportClick with the report's bill type and date when clicked.
                  onClick={() =>
                    onReportClick(report.bill_type, new Date(report.date))
                  }
                >
                  <span>{report.bill_type}</span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsList;
