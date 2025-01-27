import React, { useState } from "react";

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
    setFormData({ ...formData, [name]: value });
  };
//TODO: not working right
  const handleDateChange = (date) => {
    // Update form data with selected date
    setFormData({ ...formData, date });
    console.log(date)
    console.log(formData)
    setIsDateSelected(true);
    
    // Check existing bills for this date and update disabled bill types
    const existingForDate = existingBills.filter(bill => {
      console.log(`bill ${bill}`);
      const billDate = new Date(bill.date);
      return (
        billDate.getFullYear() === new Date(date).getFullYear() &&
        billDate.getMonth() === new Date(date).getMonth()
      );
    });

    // Extract bill types from existing bills
    const types = existingForDate.map(bill => bill.bill_type);
    console.log(types);
    setDisabledBillTypes(types);
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

                        {/* Date Field */}
                        <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={e=>handleDateChange(e.target.value)}
                className="w-48 p-3 border border-gray-300 rounded-xl focus:outline-none text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            {isDateSelected &&
            
            <>
            
            {/* Bill Type Field */}
            <div className="flex flex-row items-center">
              <label className="block w-28 text-m font-semibold text-gray-600">
                Bill Type
              </label>
              <select
                id="billType"
                name="billType"
                value={isBillTypeDisabled?"Select Bill type" : formData.billType}
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
                </>
                }


          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 font-semibold rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
            Cancel
          </button>
          {isDateSelected &&
          <button
            onClick={(e)=>{
              e.preventDefault();
              // if (existingBills.some(bill => 
              //   new Date(bill.date).getFullYear() === new Date(formData.date).getFullYear() &&
              //   new Date(bill.date).getMonth() === new Date(formData.date).getMonth() &&
              //   bill.bill_type === formData.billType)) {
              //   alert("A bill of this type already exists for the selected month.");
              //   return;
              // }
              addBill();
            }}
            className="px-4 py-2 font-semibold rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </button>
          }
        </div>

      </div>
    </div>
  );
}

export default Modal;
