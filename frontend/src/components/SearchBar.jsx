// src/components/SearchBar.jsx

export default function SearchBar({ placeholder = "Search...", onChange }) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 pr-10 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <svg
        className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2.5a7.5 7.5 0 000 15z"
        />
      </svg>
    </div>
  );
}
