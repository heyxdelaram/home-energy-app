"use client";

import React, { useState, useEffect } from "react";

/**
 * ReportData Component
 *
 * This component displays and manages the report form data including the bill type, cost, usage, and date.
 * It allows users to edit the data, validate inputs, save changes (or update an existing report), and cancel edits.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.formData - The current report form data.
 * @param {Function} props.setFormData - Function to update the report form data.
 * @param {Function} props.resetFormData - Function to reset the report form data.
 * @param {Function} props.onSave - Function to save a new report.
 * @param {Function} props.onUpdate - Function to update an existing report.
 * @param {Object} props.lastReport - The last saved report data.
 * @param {Function} props.handleReportClick - Function to handle a report click event.
 * @returns {JSX.Element} The ReportData component.
 */
const ReportData = ({
  formData,
  setFormData,
  resetFormData,
  onSave,
  onUpdate,
  lastReport,
  handleReportClick,
}) => {
  // Local state for form data when editing
  const [localFormData, setLocalFormData] = useState(formData);
  // Flag to track if the form is in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // Flag to track if the form is currently being saved
  const [saving, setSaving] = useState(false);
  // Error message state
  const [error, setError] = useState(null);

  /**
   * useEffect hook to update local form data when the main formData changes.
   * This hook only updates localFormData if not currently in editing mode.
   */
  useEffect(() => {
    if (!isEditing) {
      setLocalFormData({ ...formData });
    }
  }, [formData, isEditing]);

  /**
   * Handles changes to the input fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate numeric inputs for cost and usage
    if (name === "cost" || name === "usage") {
      if (!value || isNaN(parseFloat(value))) {
        setError("Please enter a valid number for cost or usage.");
        return;
      }
    }

    // Update local form data state
    setLocalFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(null);
  };

  /**
   * Saves the current local form data.
   *
   * This function will either update an existing report if lastReport exists, or save a new report.
   * It also handles setting the saving state and error messages.
   */
  const handleSave = async () => {
    setSaving(true);
    setIsEditing(false);

    try {
      // Check if there's an existing report to update
      if (lastReport && lastReport.id) {
        await onUpdate(localFormData, lastReport.id);
        // Trigger additional report click handling after update
        handleReportClick(lastReport.bill_type, new Date(lastReport.date));
      } else {
        // Save as a new report
        await onSave(localFormData);
      }
      // Update parent form data state after successful save/update
      setFormData(localFormData);
    } catch (err) {
      console.error("Error saving report:", err);
      setError("Failed to save report. Please try again.");
    }

    setSaving(false);
  };

  /**
   * Cancels the current editing session and resets the local form data to the original formData.
   */
  const handleCancel = () => {
    setIsEditing(false);
    setLocalFormData(formData);
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-6 col-span-2">
      <div className="flex flex-row items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-left">Report Data</h3>
        {/* Show Edit button when not in editing mode */}
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
          {/* Bill Type Input */}
          <div className="flex flex-row items-center">
            <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
              Bill Type
            </label>
            <select
              name="billType"
              className="w-32 p-3 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-600 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              value={localFormData.billType}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="water">Water</option>
              <option value="gas">Gas</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>

          {/* Cost Input */}
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

          {/* Usage Input */}
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

          {/* Date Input */}
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

        {/* Editing Buttons: Save and Cancel */}
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

        {/* Display error message if present */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ReportData;
