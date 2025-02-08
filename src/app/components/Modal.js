import React, { useState, useEffect } from "react";

/**
 * Modal component for adding a new bill entry.
 * 
 * @param {Object} props
 * @param {Function} props.closeModal - Function to close the modal.
 * @param {Object} props.formData - The current form data being entered.
 * @param {Function} props.setFormData - Function to update form data.
 * @param {Function} props.addBill - Function to add the new bill.
 * @param {Function} props.setIsModalOpen - Function to toggle the modal open/close state.
 * @param {Array} props.existingBills - Array of existing bills to determine which bill types are already present.
 * 
 * @returns {JSX.Element} - A modal component for adding a new bill.
 */
function Modal({
  closeModal,
  formData,
  setFormData,
  addBill,
  setIsModalOpen,
  existingBills,
}) {
  // State to track disabled bill types based on existing bills for the selected month
  const [disabledBillTypes, setDisabledBillTypes] = useState([]);
  // State to track if a date has been selected
  const [isDateSelected, setIsDateSelected] = useState(false);

  // Check if a bill type should be disabled based on the selected date and existing bills
  const isBillTypeDisabled = (billType) => disabledBillTypes.includes(billType);

  /**
   * Handle input field changes to update form data.
   * 
   * @param {Object} e - The event object from the input change.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Update the list of disabled bill types based on the selected date and existing bills.
   * 
   * @param {string} date - The selected date in string format.
   */
  const updateDisabledBillTypes = (date) => {
    if (!existingBills || !Array.isArray(existingBills)) {
      console.warn("existingBills is undefined or not an array");
      return;
    }

    const selectedDate = new Date(date);
    // Filter existing bills for the selected month and year
    const existingForDate = existingBills.filter((bill) => {
      if (!bill.date) return false;
      const billDate = new Date(bill.date);
      return (
        billDate.getFullYear() === selectedDate.getFullYear() &&
        billDate.getMonth() === selectedDate.getMonth()
      );
    });

    // Get all bill types for the selected month and disable those types
    const types = existingForDate.map((bill) => bill.bill_type);
    setDisabledBillTypes(types);
  };

  /**
   * Handle date selection and update form data.
   * 
   * @param {string} date - The selected date.
   */
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
    setIsDateSelected(true);
    updateDisabledBillTypes(date);
  };

  // Effect hook to trigger whenever the form data or existing bills change
  useEffect(() => {
    if (formData.date) {
      setIsDateSelected(true);
      updateDisabledBillTypes(formData.date);
    } else {
      setIsDateSelected(false);
      setDisabledBillTypes([]);
    }
  }, [formData.date, existingBills]);

  /**
   * Handle form submission to save the bill. If the selected bill type is already present, it will show an alert.
   * 
   * @param {Object} e - The event object from the form submission.
   */
  const handleSave = (e) => {
    e.preventDefault();
    if (disabledBillTypes.includes(formData.billType)) {
      alert("This bill type already exists for the selected month.");
      return;
    }
    addBill();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-none flex justify-center items-center z-50"
      onClick={closeModal} // Close modal when clicking outside the modal content
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:w-[600px]"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the modal content
      >
        <h2 className="text-xl text-black dark:text-zinc-200 font-bold mb-8 mt-8 text-center">
          Add New Bill
        </h2>
        <form className="space-y-4 flex flex-col items-center lg:mx-32">
          <div className="space-y-4">
            {/* Date input field */}
            <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600 dark:text-zinc-400">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-48 p-3 border border-gray-300 dark:border-zinc-900 dark:bg-zinc-800 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Display bill type and cost inputs if date is selected */}
            {isDateSelected && (
              <>
                <div className="flex flex-row items-center">
                  <label className="block w-28 text-m font-semibold dark:text-zinc-400 text-gray-600">
                    Bill Type
                  </label>
                  <select
                    id="billType"
                    name="billType"
                    value={formData.billType || ""}
                    onChange={handleInputChange}
                    className="w-48 p-3 border border-gray-300 dark:border-zinc-900  bg-black text-white rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>
                      Select Bill Type
                    </option>
                    <option value="water" disabled={isBillTypeDisabled("water")}>
                      Water
                    </option>
                    <option value="gas" disabled={isBillTypeDisabled("gas")}>
                      Gas
                    </option>
                    <option value="electricity" disabled={isBillTypeDisabled("electricity")}>
                      Electricity
                    </option>
                  </select>
                </div>

                {/* Cost input field */}
                <div className="flex flex-row items-center">
                  <label className="block w-28 text-m font-semibold dark:text-zinc-400 text-gray-600">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-48 p-3 border border-gray-300 dark:border-zinc-900 dark:bg-zinc-800 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Usage input field */}
                <div className="flex flex-row items-center">
                  <label className="block w-28 text-m font-semibold dark:text-zinc-400 text-gray-600">
                    Usage
                  </label>
                  <input
                    type="number"
                    name="usage"
                    value={formData.usage}
                    onChange={handleInputChange}
                    className="w-48 p-3 border border-gray-300 dark:border-zinc-900 dark:bg-zinc-800 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                    placeholder="Enter usage"
                  />
                </div>
              </>
            )}
          </div>
        </form>

        {/* Modal action buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 font-semibold rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 dark:border-zinc-900 dark:bg-zinc-700 dark:text-zinc-300"
          >
            Cancel
          </button>
          {isDateSelected && (
            <button
              onClick={handleSave}
              className="px-4 py-2 font-semibold rounded-xl bg-green-700 dark:border-zinc-900 text-white hover:bg-green-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
