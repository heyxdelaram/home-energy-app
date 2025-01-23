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
        <div className="flex flex-col items-center">
          {/* <label className="block w-28 text-m font-semibold text-gray-600">
            Year
          </label> */}
          <select
            id="billType"
            name="billType"
            className="w-full mb-8 p-4 border border-gray-300 bg-black rounded-xl focus:outline-none text-white text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="space-y-4 text-white">
          <button className="w-full  flex items-center justify-between p-4 bg-green-600 rounded-xl hover:bg-gray-200">
            <span>January</span>
            <span>11:22 PM</span>
          </button>
          <button className="w-full  flex items-center justify-between bg-green-400 p-4 rounded-xl hover:bg-gray-200">
            <span>March</span>
            <span>11:22 PM</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
