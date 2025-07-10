// frontend/src/sections/Community.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer"; // Assuming Footer is in the same 'sections' directory
import { useAuth } from "../contexts/AuthContext"; // We only need isLoading from useAuth here
import axios from 'axios'; // Import axios for fetching data

// Make sure you have this component created in frontend/src/components/CommunityStatsSection.jsx
import CommunityStatsSection from '../components/CommunityStatsSection';

export default function Community() {
  const { isLoading: isAuthLoading } = useAuth();
  const [latestDiscussions, setLatestDiscussions] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [errorLatest, setErrorLatest] = useState(null);

  // Fetch only a few latest discussion posts for preview on the overview page
  const fetchLatestDiscussions = useCallback(async () => {
    setLoadingLatest(true);
    setErrorLatest(null);
    try {
      // Use axios for consistency, and add a limit to fetch only a few for preview
      const response = await axios.get('http://localhost:5000/api/community/discussions?limit=5'); // Fetch top 5 for preview
      setLatestDiscussions(response.data);
    } catch (err) {
      console.error("Failed to fetch latest discussion posts for Community overview:", err.response?.data || err.message);
      setErrorLatest("Failed to load latest discussions preview.");
    } finally {
      setLoadingLatest(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchLatestDiscussions();
    }
  }, [isAuthLoading, fetchLatestDiscussions]);

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-700 dark:text-green-400">Welcome to the Community</h1>
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            Connect, share, and grow with fellow farmers. Discuss challenges, share tips, and stay updated.
          </p>

          <CommunityStatsSection />

          <div className="grid md:grid-cols-2 gap-6 mt-8 mb-12">
            <Link to="/community/discussions" className="block">
              <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">Discussions</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Start or join conversations about farming practices, challenges, and solutions.
                </p>
              </div>
            </Link>

            <Link to="/community/events" className="block">
              <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">Events</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Stay updated with upcoming meetups, workshops, and agricultural fairs.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-400">Latest Discussions</h2>
            {loadingLatest ? (
              <p className="text-lg text-green-600 dark:text-green-400">Loading latest discussions...</p>
            ) : errorLatest ? (
              <p className="text-lg text-red-600 dark:text-red-400">Error loading latest discussions: {errorLatest}</p>
            ) : latestDiscussions.length > 0 ? (
              <div className="grid md:grid-cols-1 gap-6 text-left">
                {latestDiscussions.map((post) => (
                  <div
                    key={post._id}
                    className={`relative rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-[1.02] ${
                      post.imageUrl ? '' : 'bg-gray-100 dark:bg-gray-800' // Apply default background if no image
                    }`}
                    style={post.imageUrl ? {
                      backgroundImage: `url(${post.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '150px' // Ensure a consistent height for cards
                    } : { minHeight: '150px' }} // Apply minHeight even without image
                  >
                    {/* Optional: Dark overlay for text readability, only if image exists */}
                    {post.imageUrl && (
                      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
                    )}
                    {/* Content of the card (title, content, author, etc.) */}
                    <Link to={`/community/discussions/${post._id}`} className="block relative z-10 p-4">
                      <h3 className="text-lg font-semibold mb-1 text-white dark:text-gray-100 drop-shadow-lg">
                        {post.title}
                      </h3>
                      <p className="text-sm text-white dark:text-gray-200 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="mt-2 text-xs text-gray-200 dark:text-gray-300">
                        <span>By {post.author ? post.author.name : 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No discussions yet. Be the first to start one!</p>
            )}
            <div className="mt-6 flex justify-center">
              <Link
                to="/community/discussions"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
              >
                View All Discussions
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}