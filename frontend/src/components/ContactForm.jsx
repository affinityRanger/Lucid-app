// src/components/ContactForm.jsx

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", form);
    setSubmitted(true);
    // Reset form
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
      {submitted && (
        <p className="text-green-600 dark:text-green-400 font-medium">
          ✅ Your message has been sent!
        </p>
      )}
      <div>
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Message</label>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-green-700 to-green-500 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition"
      >
        Send Message
      </button>
    </form>
  );
}
