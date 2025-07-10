import { createContext, useContext, useEffect, useState } from "react";

// 1. Create the ThemeContext
const ThemeContext = createContext();

// 2. ThemeProvider wraps your app and provides theme state
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Read from localStorage or default to "light"
    return localStorage.getItem("theme") || "light";
  });

  // 3. Update localStorage and <html> class on theme change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 4. Function to toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 5. Provide theme and toggleTheme to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 6. Custom hook to use the theme safely
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
