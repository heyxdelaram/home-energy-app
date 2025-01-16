"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Right Section */}
      <div className="flex flex-1 flex-col  items-center justify-center px-8 bg-white">
        <button
          className="self-start font-bold text-gray-600 hover:text-gray-800 ml-0.5 mb-16"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500">Log in to your Account</p>
          {error && <p className="text-red-500 text-sm mb-4">* {error}</p>}
          <form onSubmit={handleLogin} className="space-y-4 mt-10">
            {/* Email Field */}
            <div>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Field */}
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
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
            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              {/**
               * TODO: implement remember me functionality
               */}
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              {/**
               * TODO: create a forgot password page
               */}
              <a href="#" className="text-green-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-16 font-bold py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Log in
            </button>
          </form>
          <p className="text-sm mt-16 text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-white">
        <div className="w-3/4 h-5/6 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}
