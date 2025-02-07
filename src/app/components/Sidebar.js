"use client";

import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { supabase } from "../../../lib/supabaseClient";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false); // State for Help Modal

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error);
    } else {
      window.location.href = "/login"; // Redirect to login page
    }
  };

  return (
    <>
      {!isOpen && (
        <nav className="bg-white dark:bg-zinc-900 w-full lg:hidden left-4 p-2 font-extrabold dark:text-zinc-200 text-gray-800 fixed z-40">
          <button onClick={() => setIsOpen(true)}>☰</button>
        </nav>
      )}
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // Close when clicking outside
        ></div>
      )}
      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-fixed bg-gray-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-200 p-6 flex flex-col justify-between z-40 transform transition-transform rounded-xl m-4 ${
          isOpen ? "translate-x-0 h-full" : "-translate-x-full "
        } lg:translate-x-0 lg:static lg:w-48 pt-24 pb-24`}
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
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => setShowHelpModal(true)} // Show help modal
          >
            <FaQuestionCircle color="green" /> {/* Help Icon */}
            <span>Help</span>
          </a>
        </div>
        {/* Footer Links */}
        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => (window.location.href = "/settings")}
          >
            <FaCog color="green" /> {/* Settings Icon */}
            <span>Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => setShowLogoutModal(true)} // Show logout confirmation modal
          >
            <FaSignOutAlt color="green" /> {/* Log Out Icon */}
            <span>Log Out</span>
          </a>
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      {showLogoutModal && (
        <>
          {/* Overlay for Modal */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl text-black">
              <h2 className="text-lg font-semibold">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowLogoutModal(false)} // Close modal
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => {
                    handleLogout(); // Call logout function
                    setShowLogoutModal(false); // Close modal after logout
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <>
          {/* Overlay for Help Modal */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Help Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl text-black max-w-md w-full">
              <h2 className="text-lg font-semibold">Help Information</h2>
              <p>This application helps you manage your tasks efficiently.</p>
              <p>Here are some features:</p>
              <ul className="list-disc pl-5">
                <li>Create and manage reports.</li>
                <li>Track your usage and costs.</li>
                <li>Access settings and help resources.</li>
              </ul>
              {/* Add more help content here as needed */}
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowHelpModal(false)} // Close modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
