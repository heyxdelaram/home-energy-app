"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        if (supabaseError.status === 400) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(supabaseError.message || "An unknown error occurred.");
        }
        setEmail("");
        setPassword("");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-950">
      <div className="p-6 bg-white rounded-2xl">
        <h1 className="text-2xl text-center text-green-900 font-bold mb-4">
          Login
        </h1>
        {error && <p className="text-red-500 py-2 px-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            className="w-full px-4 py-2 rounded-lg bg-green-800 text-white"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
