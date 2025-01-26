import React from "react";

function Modal({
  closeModal,
  formData,
  setFormData,
  addBill,
  setIsModalOpen,
  existingBills,
}) {
  const isBillTypeDisabled = (billType) => existingBills.includes(billType);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-none flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-3xl p-8 lg:w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-black font-bold mb-8 mt-8 text-center">
          Add New Bill
        </h2>
        <form className="space-y-4 flex flex-col items-center lg:mx-32">
          <div className="space-y-4">
            {/* Bill Type Field */}
            <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600">
                Bill Type
              </label>
              <select
                id="billType"
                name="billType"
                value={formData.billType}
                onChange={handleInputChange}
                className="w-48 p-3 border border-gray-300 bg-black rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="water" disabled={isBillTypeDisabled("water")}>
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
            {/* Cost Field */}
            <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-48 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
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
                value={formData.usage}
                onChange={handleInputChange}
                className="w-48 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
                placeholder="Enter usage"
              />
            </div>

            {/* Date Field */}
            <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-48 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </form>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 font-semibold rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={(e)=>{
              e.preventDefault();
              addBill();
            }}
            className="px-4 py-2 font-semibold rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
