import { FaPlus } from "react-icons/fa";

export default function ReportsList({ isModalOpen, setIsModalOpen }) {
  return (
    <div className="bg-gray-100 text-black rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Reports</h3>
        <button
          className="text-green-500 hover:bg-green-100 p-2 rounded-xl"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus size={18} />
        </button>
      </div>
      {/* Report items */}
    </div>
  );
}
