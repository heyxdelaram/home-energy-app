"use client";

import React, { useState, useEffect } from "react";

const ReportData = ({
  formData,
  setFormData,
  resetFormData,
  onSave,
  onUpdate,
  lastReport,
  handleReportClick,
}) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) {
      setLocalFormData({ ...formData });
    }
  }, [formData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cost" || name === "usage") {
      if (!value || isNaN(parseFloat(value))) {
        setError("Please enter a valid number for cost or usage.");
        return;
      }
    }

    setLocalFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setIsEditing(false);

    try {
      if (lastReport && lastReport.id) {
        await onUpdate(localFormData, lastReport.id);
        handleReportClick(lastReport.bill_type, new Date(lastReport.date));
      } else {
        await onSave(localFormData);
      }
      setFormData(localFormData);
    } catch (err) {
      console.error("Error saving report:", err);
      setError("Failed to save report. Please try again.");
    }

    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalFormData(formData);
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-6 col-span-2">
      <div className="flex flex-row items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-left">Report Data</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-xl py-1 px-4 bg-green-600 text-white font-medium hover:bg-green-800"
          >
            Edit
          </button>
        )}
      </div>

      <form className="space-y-4 flex flex-col items-center justify-between">
        <div className="space-y-4">
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
              Bill Type
            </label>
            <select
              name="billType"
              className="w-32 p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-600  rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              value={localFormData.billType}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="water">Water</option>
              <option value="gas">Gas</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>

          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
              Cost
            </label>
            <input
              type="number"
              name="cost"
              value={localFormData.cost}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-600 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>

          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
              Usage
            </label>
            <input
              type="number"
              name="usage"
              value={localFormData.usage}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-600 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>

          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={localFormData.date}
              onChange={handleInputChange}
              className="w-32 p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-600 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-800"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
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
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ReportData;
