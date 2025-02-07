"use client";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
const formatShortDate = (date) => {
  return date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDetailedDate = (date) => {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
};
function Header({ user }) {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    // Add or remove the "dark" class on the root element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const todayDate = new Date();
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
          className="text-gray-900 hover:text-white hover:dark:bg-green-800 hover:bg-green-800  dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        <div className="bg-gray-100 flex flex-row gap-2 md:px-4 py-2 rounded-full shadow-sm text-sm text-black dark:bg-zinc-800 dark:text-zinc-200">
          <FaCalendarAlt />
          <span>{formatShortDate(todayDate)}</span>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-zinc-800 text-sm font-semibold text-gray-500 dark:text-zinc-200 p-2 rounded-full mt-4">
        <p>⚠️ You have 3 unassigned monthly reports.</p>
      </div>
    </header>
  );
}

export default Header;
