"use client";

import React, { useState, useEffect } from "react";

const ReportData = ({ formData, setFormData, resetFormData }) => {
  const [localFormData, setLocalFormData] = useState(formData); // Maintain local state for editing
  const [isEditing, setIsEditing] = useState(false);

  // Sync local state with parent when formData updates
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Handle input changes locally
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };

  // Save changes and update parent state
  const handleSave = () => {
    setIsEditing(false);
    setFormData(localFormData); // Sync changes to parent
  };

  // Cancel editing and revert to parent-provided data
  const handleCancel = () => {
    setIsEditing(false);
    setLocalFormData(formData); // Reset to parent state
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="bg-gray-100 rounded-xl p-6 col-span-2">
      <div className="flex flex-row items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-left">Report Data</h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="rounded-xl py-1 px-4 bg-green-600 text-white font-medium hover:bg-green-800"
          >
            Edit
          </button>
        )}
      </div>

      <form className="space-y-4 flex flex-col items-center justify-between">
        <div className="space-y-4">
          {/* Select Bill Type */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Bill Type
            </label>
            <select
              id="utility"
              name="billType"
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              value={localFormData.billType}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="water">Water</option>
              <option value="gas">Gas</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>

          {/* Cost Field */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Cost
            </label>
            <input
              type="number"
              name="cost"
              value={localFormData.cost}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>

          {/* Usage Field */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Usage
            </label>
            <input
              type="number"
              name="usage"
              value={localFormData.usage}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>

          {/* Date Field */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={localFormData.date}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        {isEditing && (
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-600 text-white rounded-xl hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportData;
