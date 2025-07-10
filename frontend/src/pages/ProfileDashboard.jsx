// src/pages/ProfileDashboard.jsx
import React, { useState } from "react";

export default function ProfileDashboard() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
    // You can send form data to a backend here
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-12">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 text-center">
          Join Our Farming Community
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
