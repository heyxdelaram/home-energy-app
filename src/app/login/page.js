"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Replace with an actual secret key

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

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
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-1 flex-col items-center justify-center px-8 bg-white">
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
            <div>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
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
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
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
          <p className="text-sm mt-16 text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center bg-white">
        <div className="w-3/4 h-5/6 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}
