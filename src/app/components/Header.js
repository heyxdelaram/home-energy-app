// Header.jsx

"use client"; // Indicating this component is intended for client-side rendering

import React, { useContext, useEffect, useState } from "react"; // Importing necessary hooks and components from React
import { FaMoon, FaSun, FaCalendarAlt } from "react-icons/fa"; // Importing icons for dark mode toggle and calendar
import { DarkModeContext } from "../DarkModeContext"; // Importing context for dark mode (currently unused)

 /**
  * Helper function to format the date to a short format.
  * 
  * @param {Date} date - The date object to format.
  * @returns {string} - The formatted date in short format (e.g., "Feb 8, 2025").
  */
const formatShortDate = (date) => {
  return date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Header component renders the header section of the app, including:
 * - Greeting message to the user
 * - Current date
 * - Dark mode toggle button
 * - Information about missing bills for specific months
 * 
 * @param {Object} user - The user object containing user metadata (e.g., first name).
 * @param {Array} fetchedReports - The list of fetched reports containing billing information.
 * @returns {JSX.Element} - The header JSX component that includes the greeting, current date, and any missing bill information.
 */
function Header({ user, fetchedReports }) {
  // State hook for managing dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Effect hook to toggle dark mode on the document root element based on state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const todayDate = new Date(); // Get the current date

  // List of month names for displaying missing months in the message
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];
  
  const currentYear = new Date().getFullYear(); // Current year
  const currentMonth = new Date().getMonth() + 1; // Current month (1-based index)
  let missingMonths = []; // Array to store months with missing bill types

  // If fetchedReports exists and is an array, calculate which months have missing bills
  if (fetchedReports && Array.isArray(fetchedReports)) {
    for (let m = 1; m <= currentMonth; m++) {
      const billsForMonth = fetchedReports.filter((report) => {
        const reportDate = new Date(report.date);
        return (
          reportDate.getFullYear() === currentYear &&
          reportDate.getMonth() + 1 === m
        );
      });
      const uniqueTypes = new Set(
        billsForMonth.map((report) => report.bill_type)
      );
      // If fewer than 3 unique bill types exist for the month, mark the month as incomplete
      if (uniqueTypes.size < 3) {
        missingMonths.push(m);
      }
    }
  }

  const missingCount = missingMonths.length; // Get the number of missing months
  const missingMonthNames = missingMonths
    .map((m) => monthNames[m - 1]) // Get the names of the missing months
    .join(", ");

  return (
    <header className="pt-4">
      <div className="flex justify-between items-center">
        <div>
          {/* Display a greeting message to the user or default to "User" */}
          {user && user.user_metadata && user.user_metadata.first_name ? (
            <h1 className="text-3xl font-bold text-gray-700 dark:text-zinc-200">
              Hello, {user.user_metadata.first_name}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-gray-700 dark:text-zinc-200">
              Hello, User
            </h1>
          )}
          {/* Display a description of the app */}
          <p className="text-gray-600 dark:text-zinc-400">
            Track your energy consumption
          </p>
        </div>
        
        {/* Dark mode toggle button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-900 hover:text-white hover:dark:bg-green-800 hover:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Display current date */}
        <div className="bg-gray-100 flex flex-row gap-2 md:px-4 py-2 rounded-full shadow-sm text-sm text-black dark:bg-zinc-800 dark:text-zinc-200">
          <FaCalendarAlt />
          <span>{formatShortDate(todayDate)}</span>
        </div>
      </div>
      
      {/* Display a warning message if there are missing months */}
      {missingCount > 0 && (
        <div className="bg-gray-100 dark:bg-zinc-800 text-sm font-semibold text-gray-500 dark:text-zinc-200 p-2 rounded-full mt-4">
          <p>
            ⚠️ There {missingCount === 1 ? "is" : "are"} {missingCount} month
            {missingCount === 1 ? "" : "s"} with incomplete bills:{" "}
            {missingMonthNames}.
          </p>
        </div>
      )}
    </header>
  );
}

export default Header;
