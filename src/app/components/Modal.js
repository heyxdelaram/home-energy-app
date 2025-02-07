import React, { useState, useEffect } from "react";

function Modal({
  closeModal,
  formData,
  setFormData,
  addBill,
  setIsModalOpen,
  existingBills,
}) {
  const [disabledBillTypes, setDisabledBillTypes] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(false);

  const isBillTypeDisabled = (billType) => disabledBillTypes.includes(billType);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateDisabledBillTypes = (date) => {
    if (!existingBills || !Array.isArray(existingBills)) {
      console.warn("existingBills is undefined or not an array");
      return;
    }

    const selectedDate = new Date(date);
    const existingForDate = existingBills.filter((bill) => {
      if (!bill.date) return false;

      const billDate = new Date(bill.date);
      return (
        billDate.getFullYear() === selectedDate.getFullYear() &&
        billDate.getMonth() === selectedDate.getMonth()
      );
    });

    const types = existingForDate.map((bill) => bill.bill_type);
    setDisabledBillTypes(types);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
    setIsDateSelected(true);
    updateDisabledBillTypes(date);
  };

  useEffect(() => {
    if (formData.date) {
      setIsDateSelected(true);
      updateDisabledBillTypes(formData.date);
    } else {
      setIsDateSelected(false);
      setDisabledBillTypes([]);
    }
  }, [formData.date, existingBills]);

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
      onClick={closeModal}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-black dark:text-zinc-200 font-bold mb-8 mt-8 text-center">
          Add New Bill
        </h2>
        <form className="space-y-4 flex flex-col items-center lg:mx-32">
          <div className="space-y-4">
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
                    <option
                      value="water"
                      disabled={isBillTypeDisabled("water")}
                    >
                      Water
                    </option>
                    <option value="gas" disabled={isBillTypeDisabled("gas")}>
                      Gas
                    </option>
                    <option
                      value="electricity"
                      disabled={isBillTypeDisabled("electricity")}
                    >
                      Electricity
                    </option>
                  </select>
                </div>

                <div className="flex flex-row items-center">
                  <label className="block w-28 text-m font-semibold dark:text-zinc-400  text-gray-600">
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
