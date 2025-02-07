// Header.jsx
"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaMoon, FaSun, FaCalendarAlt } from "react-icons/fa";
import { DarkModeContext } from "../DarkModeContext";

const formatShortDate = (date) => {
  return date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function Header({ user, fetchedReports }) {
  // const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Toggle the "dark" class on the document root element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const todayDate = new Date();

  // Compute which months (from January up to the current month) are missing one or more bill types.
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-based month number
  let missingMonths = [];

  if (fetchedReports && Array.isArray(fetchedReports)) {
    // For each month from January (1) up to the current month:
    for (let m = 1; m <= currentMonth; m++) {
      // Filter bills for the current year and for month m.
      const billsForMonth = fetchedReports.filter((report) => {
        const reportDate = new Date(report.date);
        return (
          reportDate.getFullYear() === currentYear &&
          reportDate.getMonth() + 1 === m
        );
      });
      // Get unique bill types in that month.
      const uniqueTypes = new Set(
        billsForMonth.map((report) => report.bill_type)
      );
      // If fewer than 3 bill types are found, mark the month as incomplete.
      if (uniqueTypes.size < 3) {
        missingMonths.push(m);
      }
    }
  }

  const missingCount = missingMonths.length;
  const missingMonthNames = missingMonths
    .map((m) => monthNames[m - 1])
    .join(", ");

  return (
    <header className="pt-4">
      <div className="flex justify-between items-center">
        <div>
          {user && user.user_metadata && user.user_metadata.first_name ? (
            <h1 className="text-3xl font-bold text-gray-700 dark:text-zinc-200">
              Hello, {user.user_metadata.first_name}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-gray-700 dark:text-zinc-200">
              Hello, User
            </h1>
          )}
          <p className="text-gray-600 dark:text-zinc-400">
            Track your energy consumption
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-900 hover:text-white hover:dark:bg-green-800 hover:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        <div className="bg-gray-100 flex flex-row gap-2 md:px-4 py-2 rounded-full shadow-sm text-sm text-black dark:bg-zinc-800 dark:text-zinc-200">
          <FaCalendarAlt />
          <span>{formatShortDate(todayDate)}</span>
        </div>
      </div>
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
