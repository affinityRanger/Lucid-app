// src/pages/Login.jsx

import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Logging in with:", { email, password });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white font-semibold py-2 px-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="#register" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </section>
  );
}
