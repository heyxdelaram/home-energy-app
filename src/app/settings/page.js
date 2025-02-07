"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient"; // Adjust the path as necessary
import Sidebar from "../components/Sidebar";
import { FaMoon, FaSun } from "react-icons/fa";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Prepare user data for update
    const updates = {
      email,
      data: { first_name: firstName, last_name: lastName },
    };

    // Update user metadata
    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      console.error("Error updating user:", error);
    } else {
      alert("Profile updated successfully!");
    }

    // If new password is provided, validate and update it
    if (newPassword && confirmPassword) {
      // Validate old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

      if (signInError) {
        alert("Old password is incorrect.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
      }

      // Update password
      const { updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
      } else {
        alert("Password updated successfully!");
        // Clear password fields after successful update
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8 pt-12 text-black">
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold dark:text-zinc-200">Settings</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-900 mx-32 hover:text-white hover:dark:bg-green-800 hover:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm  text-gray-700 dark:text-zinc-400 font-semibold">
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
          <div>
            <label className="block text-sm  dark:text-zinc-400 font-semibold text-gray-700">
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
          <div>
            <label className="block text-sm  dark:text-zinc-400 font-semibold text-gray-700">
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

          {/* Password Fields */}
          <div>
            <label className="block text-sm  dark:text-zinc-400 font-semibold text-gray-700">
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
              <button
                type="button"
                className="absolute inset-y-0 left-1/2 flex items-center text-gray-500"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm  dark:text-zinc-400 font-semibold text-gray-700">
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
              <button
                type="button"
                className="absolute inset-y-0 left-1/2 flex items-center text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm  dark:text-zinc-400 font-semibold text-gray-700">
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
              <button
                type="button"
                className="absolute inset-y-0 left-1/2  flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🐵" : "🙈"}
              </button>
            </div>
          </div>

          {/* Update Profile Button */}
          <button
            type="submit"
            className={`px-4 py-2 bg-green-600 text-white rounded-xl`}
          >
            Update Profile
          </button>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
