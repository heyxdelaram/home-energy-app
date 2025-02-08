"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaMoon, FaSun } from "react-icons/fa";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
      // Toggle the "dark" class on the document root element
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [darkMode]);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Validate form fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Attempt to sign up
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }, // Save additional metadata
      },
    });

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    // Show success message and redirect to login after a delay
    setSuccessMessage(
      "Account created! Please check your email to confirm your account before logging in."
    );
    setTimeout(() => {
      router.push("/login"); // Redirect to the login page
    }, 5000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Left Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 bg-white dark:bg-zinc-900">
              <div className="flex justify-between w-full items-center">
          <button
            className="self-start font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-800 ml-0.5 mb-16"
            onClick={() => router.back()}
          >
            ← Go Back
          </button>
        
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-900 hover:text-white hover:dark:bg-green-800 hover:bg-green-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-zinc-200">
            Create An Account!
          </h1>
          <p className="text-gray-500 dark:text-zinc-300">Sign Up</p>
          <form onSubmit={handleSignUp} className="space-y-4 mt-10">
            {error && <p className="text-red-500 text-sm mb-4">* {error}</p>}
            {successMessage && (
              <p className="text-green-500 py-2 px-4">{successMessage}</p>
            )}
            {/* Name Fields */}
            <div className="flex flex-1">
              <div className="mr-4">
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500 dark:border-zinc-900 dark:bg-zinc-800"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500 dark:border-zinc-900 dark:bg-zinc-800"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            {/* Email Field */}
            <div>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500 dark:border-zinc-900 dark:bg-zinc-800"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Fields */}
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500 dark:border-zinc-900 dark:bg-zinc-800"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🐵" : "🙈"}
              </button>
            </div>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500 dark:border-zinc-900 dark:bg-zinc-800"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🐵" : "🙈"}
              </button>
            </div>
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-green-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full mt-16 font-bold py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm mt-16 text-center text-gray-500 dark:text-zinc-300">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-200">
        <div className="w-3/4 h-5/6 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}
