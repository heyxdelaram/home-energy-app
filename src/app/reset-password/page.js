"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const { error: supabaseError } = await supabase.auth.updateUser({
        password,
      });

      if (supabaseError) {
        setError("Failed to reset password. Please try again.");
      } else {
        setMessage("Password reset successfully! You can now log in.");
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Reset Password
        </h1>
        <p className="text-gray-500 mb-4">
          Enter your new password to reset your account.
        </p>
        {message && <p className="text-green-500 text-sm mb-4">* {message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">* {error}</p>}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-500"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
