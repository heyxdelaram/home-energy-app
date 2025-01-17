// components/ReportList.js
export default function ReportList() {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="font-semibold mb-4">Reports</h3>
      <ul>
        <li className="mb-2">
          <button className="w-full text-left text-blue-500 hover:underline">
            January Report
          </button>
        </li>
        <li>
          <button className="w-full text-left text-blue-500 hover:underline">
            March Report
          </button>
        </li>
      </ul>
    </div>
  );
}
