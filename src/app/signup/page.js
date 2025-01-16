"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Attempt to sign up
    const { error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
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
    <div className="flex items-center justify-center min-h-screen bg-green-950">
      <div className="p-6 bg-white rounded-2xl">
        <h1 className="text-2xl text-center text-green-900 font-bold mb-4">
          Sign Up
        </h1>
        {error && <p className="text-red-500 py-2 px-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 py-2 px-4">{successMessage}</p>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg text-green-700"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg text-green-700"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg text-green-700"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="w-full px-4 py-2 rounded-lg bg-green-800 text-white"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
