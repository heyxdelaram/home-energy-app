import React from "react";
import { FaPlus } from "react-icons/fa";

const ReportsList = ({ setIsModalOpen }) => {
  return (
    <div className="bg-gray-100 text-black rounded-xl m-4 p-6 w-1/6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Reports</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-green-500 hover:bg-green-100 p-2 rounded-xl"
        >
          <FaPlus size={18} />
        </button>
      </div>
      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-600"
        >
          Year
        </label>
        <select
          id="year"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl text-gray-700 hover:bg-gray-200">
            <span>January</span>
            <span>11:22 PM</span>
          </button>
          <button className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl text-gray-700 hover:bg-gray-200">
            <span>March</span>
            <span>11:22 PM</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
