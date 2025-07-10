// frontend/src/pages/SingleDiscussionPostPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateDiscussionForm from '../components/CreateDiscussionForm';

const API_BASE_URL = 'https://backendlucid.onrender.com/'

export default function SingleDiscussionPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/community/discussions/${id}`);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching discussion post:', err.response?.data || err.message);
      setError('Failed to load post. Please check the URL or try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthLoading) {
        fetchPost();
    }
  }, [fetchPost, isAuthLoading]);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false); // Close menu
  };

  const handlePostUpdated = (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false);
    setShowMenu(false); // Close menu
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowMenu(false); // Close menu
  };

  // Function to handle post deletion
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this discussion post? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`${API_BASE_URL}/api/community/discussions/${id}`, config);
        alert('Discussion post deleted successfully!');
        navigate('/community/discussions'); // Redirect to discussions page after successful delete
      } catch (err) {
        console.error('Error deleting discussion post:', err.response?.data || err.message);
        alert(err.response?.data?.message || 'Failed to delete post.');
      } finally {
        setIsDeleting(false);
        setShowMenu(false); // Close menu
      }
    }
  };

  if (loading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-8">
        <p className="text-xl">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-8">
        <p className="text-xl text-red-500">{error}</p>
        <Link to="/community/discussions" className="mt-4 text-blue-500 hover:underline">
          Go back to discussions
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-8">
        <p className="text-xl">Post not found.</p>
        <Link to="/community/discussions" className="mt-4 text-blue-500 hover:underline">
          Go back to discussions
        </Link>
      </div>
    );
  }

  // ⭐ THE FIX IS HERE: Changed user.id to user._id ⭐
  const isAuthor = isAuthenticated && user && post.author && user._id === post.author._id;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 pt-20">
      <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl p-8">
        {isEditing ? (
          <CreateDiscussionForm
            initialData={post}
            onCreateSuccess={handlePostUpdated}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            {/* Post Image as Header/Background */}
            {post.imageUrl && (
              <div
                className="w-full h-64 rounded-lg mb-6 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${post.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-4xl font-bold p-4 break-words">
                    {post.title}
                </h1>
              </div>
            )}

            {!post.imageUrl && (
                <h1 className="text-4xl font-bold mb-4 text-green-700 dark:text-green-400 break-words">
                    {post.title}
                </h1>
            )}

            <div className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex justify-between items-center">
              <span>By: {post.author ? post.author.name : 'Unknown'}</span>
              <span>On: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="mt-8 flex justify-between items-center relative">
              <Link
                to="/community/discussions"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
              >
                Back to Discussions
              </Link>

              {/* 3-dots (kebab) menu for author actions */}
              {isAuthor && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="More options"
                  >
                    &#8230; {/* Three dots character */}
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
                      <button
                        onClick={handleEditClick}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Edit Post
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Post'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}