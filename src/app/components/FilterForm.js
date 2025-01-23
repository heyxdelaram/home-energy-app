export default function FilterForm() {
  return (
    <div className="bg-gray-100 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Filter Data</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Select Utility
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Water</option>
            <option>Gas</option>
            <option>Electricity</option>
          </select>
        </div>
        {/* Additional fields for date, time, and location */}
      </form>
    </div>
  );
}
