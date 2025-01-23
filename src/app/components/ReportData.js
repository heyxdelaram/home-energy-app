import React from "react";

const ReportData = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 col-span-2">
      <h3 className="text-lg font-bold mb-8 text-left">Report Data</h3>
      <form className="space-y-4 flex flex-col items-center">
        <div className="space-y-4">
          {/* Select Utility Field */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Bill Type
            </label>
            <select
              id="utility"
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="water">Water</option>
              <option value="gas">Gas</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>

          {/* Date Field */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportData;
