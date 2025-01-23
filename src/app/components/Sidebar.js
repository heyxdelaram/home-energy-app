import React from "react";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {!isOpen && (
        <nav className="bg-white w-full lg:hidden p-2 text-gray-800 fixed z-50">
          <button onClick={() => setIsOpen(!isOpen)}>☰</button>
        </nav>
      )}
      {/* Overlay */}
      <div
        className={` inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } `}
        onClick={() => setIsOpen(false)} // Close when clicking outside
      ></div>
      <div
        className={`fixed top-0 left-0 w-64 bg-gray-100 font-semibold text-zinc-900 p-6 flex flex-col justify-between z-40 transform transition-transform rounded-xl m-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full "
        } lg:translate-x-0 lg:static lg:w-48`}
      >
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
        {/* Footer Links */}
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
    </>
  );
}

export default Sidebar;
