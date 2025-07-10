// src/pages/Join.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = 'https://backendlucid.onrender.com'

export default function Join() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // ⭐ ADDED: phone field for signup ⭐
    phone: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ⭐ NEW: State for API errors

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      if (!isLogin && form.password !== form.confirmPassword) {
        setError("Passwords do not match"); // Set error state instead of alert
        setLoading(false);
        return;
      }

      // ⭐ CRITICAL FIX: Changed endpoints to /api/auth/ ⭐
      const endpoint = isLogin
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/register`; // Changed from /signup to /register

      // ⭐ UPDATED: Added phone to signup payload ⭐
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, phone: form.phone }; // Include phone
// ... inside handleSubmit
console.log("Sending request to:", endpoint); // ADD THIS LINE
console.log("Payload:", payload); // ADD THIS LINE TOO
      // Log the endpoint and payload for debugging
      // Make the API request
      //... Ensure you have axios installed and imported
      // npm install axios
      const res = await axios.post(endpoint, payload);

      // Assuming your backend sends back { user: { _id, name, email, phone }, token }
      login(res.data); // The login context function should handle storing both user and token
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth error:", err); // Log the full error for debugging
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg); // Set error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url('/assets/your-image.jpg')", // Ensure this image path is correct or remove
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white p-8 rounded-xl shadow-md"
      >
        <div className="flex justify-center mb-6 gap-2">
          <button
            className={`flex-1 px-4 py-2 font-semibold rounded-l-full ${
              isLogin ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
            }`}
            onClick={() => { setIsLogin(true); setError(null); }} // Clear error on tab switch
          >
            Login
          </button>
          <button
            className={`flex-1 px-4 py-2 font-semibold rounded-r-full ${
              !isLogin ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
            }`}
            onClick={() => { setIsLogin(false); setError(null); }} // Clear error on tab switch
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-xl font-bold text-center mb-4">
          {isLogin ? "Welcome Back!" : "Create a New Account"}
        </h2>

        {error && ( // ⭐ NEW: Display error message here
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block mb-1 font-medium text-sm">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
                />
              </div>
              {/* ⭐ NEW: Phone field for signup ⭐ */}
              <div>
                <label className="block mb-1 font-medium text-sm">Phone Number (Optional)</label>
                <input
                  type="tel" // Use type="tel" for phone numbers
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}