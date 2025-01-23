export default function Header() {
  return (
    <header>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Hello, Margaret</h1>
          <p className="text-gray-600">Track your energy consumption</p>
        </div>
        <button className="bg-gray-100 px-4 py-2 rounded-full shadow-sm text-sm text-black">
          {new Date().toLocaleDateString()}
        </button>
      </div>
      <div className="bg-gray-100 text-sm font-semibold text-gray-500 p-2 rounded-full mt-4">
        <p>⚠️ You have 3 unassigned monthly reports.</p>
      </div>
    </header>
  );
}
