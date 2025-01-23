export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 bg-gray-100 font-semibold text-zinc-900 p-6 flex flex-col justify-between z-50 transform transition-transform rounded-xl m-4 lg:static lg:w-48">
      <div className="space-y-2">
        <a
          href="/dashboard"
          className="block text-lg font-medium hover:text-green-400"
        >
          Dashboard
        </a>
        <a href="#" className="block text-lg hover:text-green-400">
          Reports
        </a>
      </div>
      <div className="space-y-2">
        <a href="#" className="block text-lg hover:text-gray-400">
          Settings
        </a>
        <a href="#" className="block text-lg hover:text-gray-400">
          Help
        </a>
        <a href="#" className="block text-lg text-red-400 hover:text-red-300">
          Log Out
        </a>
      </div>
    </div>
  );
}
