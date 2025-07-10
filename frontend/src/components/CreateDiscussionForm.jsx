// frontend/src/components/CreateDiscussionForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function CreateDiscussionForm({ initialData, onCreateSuccess, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(initialData?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const isEditing = !!initialData;

  useEffect(() => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setFilePreview(initialData?.imageUrl || '');
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setFilePreview(initialData?.imageUrl || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!isAuthenticated || !user || !user.token) {
      setError('You must be logged in to create/edit a post.');
      setLoading(false);
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (isEditing && initialData.imageUrl) {
        formData.append('imageUrl', initialData.imageUrl);
    } else if (isEditing && !initialData.imageUrl && !selectedFile && filePreview === '') {
        formData.append('imageUrl', '');
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:5000/api/community/discussions/${initialData._id}`,
          formData,
          config
        );
        setSuccess('Discussion post updated successfully!');
        if (onCreateSuccess) {
          onCreateSuccess(response.data);
        }
      } else {
        response = await axios.post(
          'http://localhost:5000/api/community/discussions',
          formData,
          config
        );
        setSuccess('Discussion post created successfully!');
        setTitle('');
        setContent('');
        setSelectedFile(null);
        setFilePreview('');
        if (onCreateSuccess) {
          onCreateSuccess(response.data);
        }
      }

    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} discussion post:`, err.response?.data || err.message);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg mx-auto mb-10 border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        {isEditing ? 'Edit Discussion Post' : 'Create New Discussion Post'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter discussion title (e.g., 'Best farming practices')"
            required
            maxLength="100"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="imageUpload" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('imageUpload').click()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Choose File
          </button>
          {selectedFile && (
            <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm">
              {selectedFile.name}
            </span>
          )}
          {filePreview && (
            <div className="mt-4">
              <img
                src={filePreview}
                alt="File preview" // ⭐ FIXED: Changed alt text to avoid "image" ⭐
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setFilePreview(''); }}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            rows="7"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or ideas here..."
            required
            minLength="10"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
            disabled={loading}
          >
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    </div>
  );
}