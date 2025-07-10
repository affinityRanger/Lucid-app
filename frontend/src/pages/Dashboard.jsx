import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CommunityStatsSection from '../components/CommunityStatsSection';
import CreateDiscussionOverlay from '../components/CreateDiscussionOverlay';
import { useAuth } from '../contexts/AuthContext';
import { MoreHorizontal, Pencil, Trash, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = 'https://backendlucid.onrender.com/'
export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const menuRefs = useRef({});
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/community/discussions?_=${Date.now()}`);
      setDiscussions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load discussions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchDiscussions();
    }
  }, [fetchDiscussions, isAuthLoading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    if (!user || !user.token) {
      setError('You must be logged in to delete posts.');
      return;
    }

    try {
      setDeletingId(postId);
      await axios.delete(`${API_BASE_URL}/api/community/discussions/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await fetchDiscussions();
      setSuccess('Post deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const canCreatePost = isAuthenticated && !isAuthLoading;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Community Discussions</h1>
      <CommunityStatsSection />

      <div className="flex justify-center mb-8">
        {canCreatePost ? (
          <button
            onClick={() => setShowOverlay(true)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
          >
            Create Post
          </button>
        ) : (
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            <Link to="/login" className="text-green-600 hover:underline font-semibold">
              Log in
            </Link>{' '}
            to create a new discussion post.
          </p>
        )}
      </div>

      <AnimatePresence>
        {showOverlay && (
          <CreateDiscussionOverlay
            initialData={editingPost}
            onClose={() => {
              setShowOverlay(false);
              setEditingPost(null);
            }}
            onPostCreated={() => {
              fetchDiscussions();
              setSuccess('Post saved successfully.');
              setShowOverlay(false);
              setEditingPost(null);
            }}
          />
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {loading && <p className="text-center text-lg mt-8">Loading discussions...</p>}

      {!loading && discussions.length === 0 && !error && (
        <p className="text-center text-lg mt-8">No discussions found. Be the first to start one!</p>
      )}

      {!loading && discussions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discussions.map((post) => (
            <div
              key={post._id}
              className="relative rounded-lg shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex flex-col"
            >
              {post.imageUrl && (
                <img src={`${API_BASE_URL}${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <Link
                to={`/community/discussions/${post._id}`}
                className="block flex-grow p-6 text-gray-900 dark:text-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
              </Link>
              <div className="p-6 flex justify-between items-start text-gray-900 dark:text-gray-200 relative">
                <div className="text-sm flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.name || 'User'}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <Link
                    to={`/profile/${post.author?._id || '#'}`}
                    className="hover:underline font-medium text-sm"
                  >
                    {post.author?.name || 'Unknown'}
                  </Link>
                  <span className="text-xs text-gray-500 ml-1">
                    • {post.createdAt
                      ? format(new Date(post.createdAt), 'MMMM d, yyyy')
                      : 'Unknown Date'}
                  </span>
                </div>

                {isAuthenticated && user && post.author && user._id === post.author._id && (
                  <div className="relative" ref={(el) => (menuRefs.current[post._id] = el)}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <MoreHorizontal />
                    </button>

                    <AnimatePresence>
                      {openMenuId === post._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 z-50 mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
                        >
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setShowOverlay(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            disabled={deletingId === post._id}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-800 dark:text-red-400"
                          >
                            {deletingId === post._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
