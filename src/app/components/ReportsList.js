import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const ReportsList = ({ setIsModalOpen, reports, onReportClick }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Group reports by month for the selected year
  const groupedReports = reports
    .filter((report) => {
      const reportYear = new Date(report.date).getFullYear();
      return reportYear === parseInt(selectedYear);
    })
    .reduce((acc, report) => {
      const month = new Date(report.date).toLocaleString("default", {
        month: "long",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(report);
      return acc;
    }, {});

  return (
    <div className="bg-gray-100 text-black rounded-xl lg:m-4 p-6 lg:w-1/6 m-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Reports</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-green-500 hover:bg-green-100 p-2 rounded-xl"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {/* Year Selector */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="year"
          className="block w-full text-sm font-semibold text-gray-600 mb-2"
        >
          Select Year
        </label>
        <select
          id="year"
          name="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full mb-8 p-4 border border-gray-300 bg-black rounded-xl focus:outline-none text-white text-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4 text-white">
        {Object.keys(groupedReports).length === 0 ? (
          <p className="text-center text-gray-500">No reports available</p>
        ) : (
          Object.entries(groupedReports).map(([month, reports]) => (
            <div key={month} className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                {month}
              </h4>
              {reports.map((report, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between my-2 p-4 bg-green-600 rounded-xl hover:bg-gray-200"
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
