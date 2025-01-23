import React from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaFile,
} from "react-icons/fa";

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
        } lg:translate-x-0 lg:static lg:w-48 lg:pt-24`}
      >
        <div className="space-y-2 ">
          <a
            href="/dashboard"
            className="flex items-center space-x-2 block hover:text-green-800 text-m"
          >
            <FaTachometerAlt color="green" /> {/* Dashboard Icon */}
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
          >
            <FaFileAlt color="green" /> {/* Reports Icon */}
            <span>Reports</span>
          </a>
        </div>
        {/* Footer Links */}
        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
          >
            <FaCog color="green" /> {/* Settings Icon */}
            <span>Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
          >
            <FaQuestionCircle color="green" /> {/* Help Icon */}
            <span>Help</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
          >
            <FaSignOutAlt color="green" /> {/* Log Out Icon */}
            <span>Log Out</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
