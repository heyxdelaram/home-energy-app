"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Replace with an actual secret key

import { FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";

/**
 * LoginPage Component
 *
 * Renders the login page which allows users to sign in using their email and password.
 * It includes functionality for toggling dark mode, showing/hiding the password,
 * and basic error handling during authentication.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  // State to store the email input.
  const [email, setEmail] = useState("");
  // State to store the password input.
  const [password, setPassword] = useState("");
  // State to toggle the visibility of the password.
  const [showPassword, setShowPassword] = useState(false);
  // State to store any error messages during login.
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  // State to toggle dark mode.
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    // Toggle the "dark" class on the document root element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  // Load stored credentials from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const encryptedPassword = localStorage.getItem("encryptedPassword");

    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }

    if (encryptedPassword) {
      // Decrypt the password
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        setError("Username or password incorrect");
      } else {
        // Store credentials if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            SECRET_KEY
          ).toString();
          localStorage.setItem("encryptedPassword", encryptedPassword);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("encryptedPassword");
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Right Section: Contains the login form and related UI elements */}
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
            Welcome Back!
          </h1>
          <p className="text-gray-500 dark:text-zinc-300">
            Log in to your Account
          </p>
          {error && <p className="text-red-500 text-sm mb-4">* {error}</p>}
          <form onSubmit={handleLogin} className="space-y-4 mt-10">
            <div>
              <input
                className="w-full px-4 py-2 border dark:border-zinc-900 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded-lg dark:border-zinc-900 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Button to toggle password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🐵" : "🙈"}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center dark:text-zinc-300">
                <input
                  type="checkbox"
                  className="mr-2 dark:border-zinc-900 dark:bg-zinc-800"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="text-green-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full mt-16 font-bold py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Log in
            </button>
          </form>
          <p className="text-sm mt-16 text-center text-gray-500 dark:text-zinc-300">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-zinc-900">
        <Image alt="" width={500} height={300} src="/6.jpg" className="w-3/4 h-5/6 rounded-xl"/>
      </div>
    </div>
  );
}
