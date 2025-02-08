"use client";

import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { supabase } from "../../../lib/supabaseClient";

/**
 * Sidebar component provides a navigation sidebar with links to various sections such as Dashboard,
 * Settings, and Help. It also includes modals for logout confirmation and help information.
 *
 * @component
 * @example
 * return (
 *   <Sidebar />
 * )
 */
function Sidebar() {
  // State to track whether the sidebar menu is open (used for mobile view)
  const [isOpen, setIsOpen] = useState(false);
  // State to control the visibility of the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // State to control the visibility of the help modal
  const [showHelpModal, setShowHelpModal] = useState(false);
  // Uncomment and use darkMode state if implementing a dark mode toggle
  // const [darkMode, setDarkMode] = useState(false);

  // Example useEffect to toggle dark mode by adding/removing the "dark" class on the document root.
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [darkMode]);

  /**
   * Handles the user logout process by calling the Supabase signOut method.
   * On successful logout, the user is redirected to the login page.
   */
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error);
    } else {
      window.location.href = "/login"; // Redirect to the login page after logout
    }
  };

  return (
    <>
      {/* Mobile Navigation: Displayed when the sidebar is closed (only on small screens) */}
      {!isOpen && (
        <nav className="bg-white dark:bg-zinc-900 w-full lg:hidden left-4 p-2 font-extrabold dark:text-zinc-200 text-gray-800 fixed z-40">
          <button onClick={() => setIsOpen(true)}>☰</button>
        </nav>
      )}

      {/* Overlay: Covers the screen when the sidebar is open; clicking it closes the sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking outside the menu
        ></div>
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-fixed bg-gray-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-200 p-6 flex flex-col justify-between z-40 transform transition-transform rounded-xl m-4 ${
          isOpen ? "translate-x-0 h-full" : "-translate-x-full "
        } lg:translate-x-0 lg:static lg:w-48 pt-24 pb-24`}
      >
        {/* Dark mode toggle button (currently commented out)
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-900 hover:text-white hover:dark:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        */}
        <div className="space-y-2">
          {/* Dashboard Link */}
          <a
            href="/dashboard"
            className="flex items-center space-x-2 block hover:text-green-800 text-m"
          >
            <FaTachometerAlt color="green" /> {/* Dashboard Icon */}
            <span>Dashboard</span>
          </a>
          {/* Reports Link (commented out)
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
          >
            <FaFileAlt color="green" />
            <span>Reports</span>
          </a>
          */}
          {/* Help Link: Opens the Help Modal when clicked */}
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => setShowHelpModal(true)}
          >
            <FaQuestionCircle color="green" /> {/* Help Icon */}
            <span>Help</span>
          </a>
        </div>

        {/* Footer Links */}
        <div className="space-y-2">
          {/* Settings Link: Redirects the user to the settings page */}
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => (window.location.href = "/settings")}
          >
            <FaCog color="green" /> {/* Settings Icon */}
            <span>Settings</span>
          </a>
          {/* Log Out Link: Opens the Logout Confirmation Modal */}
          <a
            href="#"
            className="flex items-center space-x-2 block text-m hover:text-green-800"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt color="green" /> {/* Log Out Icon */}
            <span>Log Out</span>
          </a>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <>
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-zinc-200 p-5 rounded-xl">
              <h2 className="text-lg font-semibold">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end">
                {/* Cancel Button: Closes the logout modal */}
                <button
                  className="mr-2 px-4 py-2 bg-gray-300 dark:bg-zinc-800 rounded-xl"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                {/* Logout Button: Calls the handleLogout function and then closes the modal */}
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-xl"
                  onClick={() => {
                    handleLogout();
                    setShowLogoutModal(false);
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
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl text-black dark:text-zinc-200 max-w-md w-full">
              <h2 className="text-lg font-semibold">Help Information</h2>
              <p>This application helps you manage your tasks efficiently.</p>
              <p>Here are some features:</p>
              <ul className="list-disc pl-5">
                <li>Create and manage reports.</li>
                <li>Track your usage and costs.</li>
                <li>Access settings and help resources.</li>
              </ul>
              {/* Additional help content can be added here */}
              <div className="mt-4 flex justify-end">
                {/* Close Button: Closes the help modal */}
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-zinc-800 rounded-xl"
                  onClick={() => setShowHelpModal(false)}
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
