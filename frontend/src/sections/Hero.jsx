// src/sections/Hero.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBackground from '../assets/images/farming-hero-bg.jpg'; // <--- Import your background image

export default function Hero() {
  return (
    <section
      id="home"
      className="relative py-24 text-center rounded-b-3xl overflow-hidden min-h-[600px] flex items-center justify-center" // Added: relative, overflow-hidden, min-h, flex, items-center, justify-center
    >
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-b-3xl" // Absolute position to cover the section
        style={{
          backgroundImage: `url(${heroBackground})`,
          // Adjust background position to effectively show half the image
          // You might need to fine-tune this depending on the image content and desired half
          // 'top', 'bottom', 'left', 'right', or percentage values like '0% 50%'
          backgroundPosition: 'center bottom', // Example: centers horizontally, aligns bottom vertically
          height: '100%', // Take full height of the section
          width: '100%', // Take full width
        }}
      >
        {/* Optional: Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-green-700/40 opacity-75"></div> {/* Darker, slightly transparent overlay */}
      </div>

      {/* Content Container - make sure it's above the background */}
      <div className="container mx-auto px-4 relative z-10 text-white"> {/* Added: relative, z-10, text-white */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-4xl font-extrabold md:text-6xl" // Removed gradient text, now white
        >
          Cultivating Success Together
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-8 max-w-xl text-lg md:text-xl" // Now white text
        >
          Connect with fellow farmers, share resources, exchange equipment, and
          grow your agricultural knowledge in our thriving community.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/join"
            className="inline-block rounded-full bg-gradient-to-r from-green-700 to-green-500 px-8 py-3 font-semibold text-white shadow-lg hover:-translate-y-1 transition"
          >
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
}