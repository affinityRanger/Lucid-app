// src/sections/Footer.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function Footer() {
  // Define links with their paths
  const quickLinks = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Browse Resources", path: "/resources" }, // Placeholder path, adjust as needed
    { name: "Community Forum", path: "/community/discussions" }, // Uses an existing route
    { name: "Help & Support", path: "/support" }, // Placeholder path, adjust as needed
  ];

  const resourceLinks = [
    { name: "Farming Guides", path: "/guides" }, // Placeholder path, adjust as needed
    { name: "Weather Updates", path: "/weather" }, // Placeholder path, adjust as needed
    { name: "Market Prices", path: "/market-prices" }, // Placeholder path, adjust as needed
    { name: "Expert Tips", path: "/tips" }, // Placeholder path, adjust as needed
  ];

  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white pt-16 pb-8 rounded-t-3xl mt-16">
      <div className="container mx-auto grid gap-8 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <section>
          <h3 className="mb-3 text-lg font-semibold text-green-200">About LUCID</h3>
          <p className="text-sm text-green-100">
            Empowering farmers through resource sharing, knowledge exchange, and
            community building.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold text-green-200">Quick Links</h3>
          <ul className="space-y-2"> {/* Added ul for semantic list */}
            {quickLinks.map((link) => (
              <li key={link.name}> {/* Added li for semantic list item */}
                <Link
                  to={link.path}
                  className="block text-sm text-green-100 hover:text-green-200 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold text-green-200">Resources</h3>
          <ul className="space-y-2"> {/* Added ul for semantic list */}
            {resourceLinks.map((link) => (
              <li key={link.name}> {/* Added li for semantic list item */}
                <Link
                  to={link.path}
                  className="block text-sm text-green-100 hover:text-green-200 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold text-green-200">Contact</h3>
          <p className="text-sm">Email: hello@lucidfarming.com</p>
          <p className="text-sm">Phone: +254‑700‑LUCID</p>
          <p className="text-sm">Nairobi, Kenya</p>
        </section>
      </div>

      <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-green-100">
        © 2025 LUCID Farming Platform. All rights reserved.
      </div>
    </footer>
  );
}