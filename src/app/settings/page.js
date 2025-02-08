"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient"; // Adjust the path as necessary
import Sidebar from "../components/Sidebar";
import { FaMoon, FaSun } from "react-icons/fa";

/**
 * SettingsPage Component
 *
 * This component renders the settings page where a user can update their profile
 * information such as first name, last name, email, and password. It also provides
 * a dark mode toggle to switch between light and dark themes.
 *
 * @component
 * @example
 * return (
 *   <SettingsPage />
 * )
 *
 * @returns {JSX.Element} The rendered SettingsPage component.
 */
const SettingsPage = () => {
  // State for the authenticated user object.
  const [user, setUser] = useState(null);
  // State for the user's first name.
  const [firstName, setFirstName] = useState("");
  // State for the user's last name.
  const [lastName, setLastName] = useState("");
  // State for the user's email.
  const [email, setEmail] = useState("");
  // State for the user's current (old) password.
  const [oldPassword, setOldPassword] = useState("");
  // State for the new password.
  const [newPassword, setNewPassword] = useState("");
  // State for the confirmation of the new password.
  const [confirmPassword, setConfirmPassword] = useState("");
  // State to toggle the visibility of the old password field.
  const [showOldPassword, setShowOldPassword] = useState(false);
  // State to toggle the visibility of the new password field.
  const [showNewPassword, setShowNewPassword] = useState(false);
  // State to toggle the visibility of the confirm password field.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State to control dark mode; toggles the "dark" CSS class on the document element.
  const [darkMode, setDarkMode] = useState(false);

  /**
   * useEffect hook for toggling dark mode.
   *
   * Adds or removes the "dark" class on the document root element based on the
   * current value of the darkMode state.
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /**
   * useEffect hook for fetching user data.
   *
   * Retrieves the authenticated user's data from Supabase and updates the component's state
   * with the user's first name, last name, and email.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUser(user);
        setFirstName(user?.user_metadata?.first_name || "");
        setLastName(user?.user_metadata?.last_name || "");
        setEmail(user?.email || "");
      }
    };

    fetchUserData();
  }, []);

  /**
   * Handles the form submission to update the user profile.
   *
   * Updates the user's profile information (email, first name, last name) in Supabase.
   * If a new password is provided, it validates the old password, checks for a match
   * between the new password and the confirmation, and updates the password accordingly.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Prepare user data for update (email and user metadata).
    const updates = {
      email,
      data: { first_name: firstName, last_name: lastName },
    };

    // Update user metadata in Supabase.
    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      console.error("Error updating user:", error);
    } else {
      alert("Profile updated successfully!");
    }

    // If new password and confirmation are provided, process password update.
    if (newPassword && confirmPassword) {
      // Validate the old password by signing in.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

      if (signInError) {
        alert("Old password is incorrect.");
        return;
      }

      // Check if the new password and its confirmation match.
      if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
      }

      // Update the password using Supabase.
      const { updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
      } else {
        alert("Password updated successfully!");
        // Clear password fields after successful update.
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar component for navigation */}
      <Sidebar />
      <main className="flex-1 p-8 space-y-8 pt-12 text-black">
        {/* Header section with page title and dark mode toggle */}
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold dark:text-zinc-200">Settings</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-900 mx-32 hover:text-white hover:dark:bg-green-800 hover:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
        {/* Profile Update Form */}
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
          {/* First Name Field */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-zinc-400 font-semibold">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                required
              />
            </div>
          </div>
          {/* Last Name Field */}
          <div>
            <label className="block text-sm dark:text-zinc-400 font-semibold text-gray-700">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                required
              />
            </div>
          </div>
          {/* Email Field */}
          <div>
            <label className="block text-sm dark:text-zinc-400 font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                required
              />
            </div>
          </div>

          {/* Old Password Field */}
          <div>
            <label className="block text-sm dark:text-zinc-400 font-semibold text-gray-700">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                placeholder="Enter old password"
              />
              {/* Button to toggle old password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 left-1/2 flex items-center text-gray-500"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm dark:text-zinc-400 font-semibold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                placeholder="Enter new password"
              />
              {/* Button to toggle new password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 left-1/2 flex items-center text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="block text-sm dark:text-zinc-400 font-semibold text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:border-zinc-900 focus:ring-green-500 text-green-500"
                placeholder="Confirm new password"
              />
              {/* Button to toggle confirm password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 left-1/2 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          {/* Update Profile Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            Update Profile
          </button>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
