"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaMoon, FaSun } from "react-icons/fa";

/**
 * SignUpPage Component
 *
 * Renders a sign-up page that allows new users to create an account.
 * The page includes fields for first name, last name, email, password, and password confirmation.
 * It also implements dark mode toggle functionality.
 *
 * @component
 * @example
 * return <SignUpPage />;
 *
 * @returns {JSX.Element} The rendered SignUpPage component.
 */
export default function SignUpPage() {
  // State to store the email input.
  const [email, setEmail] = useState("");
  // State to store the password input.
  const [password, setPassword] = useState("");
  // State to store the user's first name.
  const [firstName, setFirstName] = useState("");
  // State to store the user's last name.
  const [lastName, setLastName] = useState("");
  // State to store the password confirmation input.
  const [confirmPassword, setConfirmPassword] = useState("");
  // State to control the visibility of the password fields.
  const [showPassword, setShowPassword] = useState(false);
  // State to store error messages.
  const [error, setError] = useState(null);
  // State to store a success message after account creation.
  const [successMessage, setSuccessMessage] = useState("");
  // Next.js router for navigation.
  const router = useRouter();
  // State to toggle dark mode.
  const [darkMode, setDarkMode] = useState(false);

  /**
   * useEffect hook for toggling dark mode.
   *
   * Adds or removes the "dark" CSS class on the document root element
   * based on the value of the darkMode state.
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /**
   * Handles the sign-up form submission.
   *
   * Validates that all fields are filled out and that the password
   * matches the confirmation. If validation passes, attempts to sign up
   * the user using Supabase. On success, displays a success message and
   * redirects the user to the login page after a delay.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Validate that all fields are provided.
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Validate that password and confirmPassword match.
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Attempt to sign up using Supabase.
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }, // Save additional metadata
      },
    });

    // Handle sign-up errors.
    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    // On success, show a success message and redirect to the login page after 5 seconds.
    setSuccessMessage(
      "Account created! Please check your email to confirm your account before logging in."
    );
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Left Section: Sign-up form and UI elements */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 bg-white dark:bg-zinc-900">
        <div className="flex justify-between w-full items-center">
          {/* Back button: Navigates to the previous page */}
          <button
            className="self-start font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-800 ml-0.5 mb-16"
            onClick={() => router.back()}
          >
            ← Go Back
          </button>
          {/* Dark mode toggle button */}
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
          {/* Display error message if any */}
          {error && <p className="text-red-500 text-sm mb-4">* {error}</p>}
          {/* Display success message if account creation is successful */}
          {successMessage && (
            <p className="text-green-500 py-2 px-4">{successMessage}</p>
          )}
          <form onSubmit={handleSignUp} className="space-y-4 mt-10">
            {/* Name Fields: First Name and Last Name */}
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
            {/* Password Field */}
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
            {/* Confirm Password Field */}
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
            {/* Remember Me and Forgot Password Section */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
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
      {/* Right Section: Displayed on medium screens and above */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-200">
        <div className="w-3/4 h-5/6 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}
