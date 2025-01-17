// components/DataSelector.js
export default function DataSelector() {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="font-semibold mb-2">Filter Data</h3>
      <select className="w-full mb-4 p-2 border rounded">
        <option>Water</option>
        <option>Gas</option>
        <option>Electricity</option>
      </select>
      <select className="w-full p-2 border rounded">
        <option>January</option>
        <option>February</option>
      </select>
    </div>
  );
}
