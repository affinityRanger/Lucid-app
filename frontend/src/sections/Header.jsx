import React, { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Moon, Sun, User, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { to: "#home", label: "Home" },
  { to: "/community", label: "Community" }, // <-- THIS LINE IS UPDATED
  { to: "/marketplace", label: "Marketplace" },
  { to: "#knowledge", label: "Knowledge" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // State for the user dropdown

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null); // Ref for the dropdown container
  const profileButtonRef = useRef(null); // Ref for the profile button

  // Handle scroll direction (hide/show header on scroll)
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // This useEffect will close both the mobile menu and the user dropdown
  // whenever the route changes (e.g., navigating from / to /dashboard).
  useEffect(() => {
    setOpen(false); // Close mobile menu on route change
    setShowDropdown(false); // Close user dropdown on route change
  }, [location.pathname]); // Dependency: only run when location.pathname changes

  // Handle clicks outside the user dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred outside the dropdown container AND outside the button that toggles it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      // Add event listener only when the dropdown is open
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Clean up the event listener when component unmounts or dropdown closes
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]); // Dependency: run when showDropdown state changes

  // Handle clicks for navigation links (both anchor links and route links)
  const handleLinkClick = (e, to) => {
    e.preventDefault(); // Prevent default link behavior

    if (to.startsWith("#")) {
      // If it's an anchor link (e.g., #home, #knowledge)
      if (location.pathname === "/") {
        // If already on the homepage, scroll to the section
        const section = document.querySelector(to);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } else {
        // If not on the homepage, navigate to the homepage and then scroll
        // The useEffect for location.pathname will handle closing menus.
        navigate(`/${to}`); // Navigates to e.g., /#home or /#knowledge
      }
    } else {
      // If it's a regular route link (e.g., /marketplace, /community, /join)
      navigate(to);
    }
    setOpen(false); // Always close mobile menu on any link click
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 bg-white/90 dark:bg-gray-900 shadow-md backdrop-blur ${
        scrollDir === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "#home")}
          className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent"
        >
          LUCID
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <a
                href={to}
                onClick={(e) => handleLinkClick(e, to)}
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side - Search, Theme Toggle, User/Join */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile/Join Button Conditional Rendering */}
          {user ? (
            <div className="relative">
              <button
                ref={profileButtonRef} // Attach ref
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition"
                aria-label="User profile menu"
              >
                <User size={18} />
                {user.name?.split(" ")[0] || "Profile"}
              </button>

              {showDropdown && (
                <div
                  ref={dropdownRef} // Attach ref
                  className="absolute right-0 mt-2 w-40 rounded shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50"
                >
                  <button
                    onClick={() => {
                      setShowDropdown(false); // Close dropdown on Dashboard click
                      navigate("/dashboard");
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false); // Close dropdown on Logout click
                      navigate("/"); // Navigate to home after logout
                    }}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="inline-block mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/join"
              onClick={(e) => handleLinkClick(e, "/join")}
              className="rounded-full bg-gradient-to-r from-green-700 to-green-400 px-4 py-2 font-semibold text-white shadow hover:scale-105 transition-transform"
            >
              Join
            </a>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-gray-800 dark:text-gray-200"
          aria-label="Toggle mobile menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-[500px]" : "max-h-0" // Controls expand/collapse height
        }`}
      >
        <ul className="space-y-4 bg-white dark:bg-gray-900 px-6 py-4">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <a
                href={to}
                onClick={(e) => handleLinkClick(e, to)}
                className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400"
              >
                {label}
              </a>
            </li>
          ))}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded border text-sm dark:bg-gray-800 dark:text-white text-gray-800"
          />
          {user ? (
            <>
              <button
                onClick={() => {
                  setOpen(false); // Close mobile menu
                  navigate("/dashboard");
                }}
                className="w-full bg-green-600 text-white py-2 rounded font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpen(false); // Close mobile menu
                  navigate("/");
                }}
                className="w-full mt-2 bg-red-600 text-white py-2 rounded font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/join"
              onClick={(e) => handleLinkClick(e, "/join")}
              className="block bg-gradient-to-r from-green-700 to-green-400 px-4 py-2 text-center text-white rounded font-semibold shadow hover:scale-105 transition-transform"
            >
              Join
            </a>
          )}
          <button
            onClick={toggleTheme}
            className="w-full mt-2 flex justify-center items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />} Toggle Theme
          </button>
        </ul>
      </div>
    </header>
  );
}