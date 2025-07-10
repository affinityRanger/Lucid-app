// frontend/src/pages/Marketplace.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../sections/Footer";
import axios from "axios"; // ⭐ ADDED AXIOS IMPORT ⭐

const API_BASE_URL = 'https://backendlucid.onrender.com'

export default function Marketplace() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Renamed isLoading to isAuthLoading to avoid conflict

  const [listings, setListings] = useState([]);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isLoadingListings, setIsLoadingListings] = useState(true); // Renamed to isLoadingListings for clarity
  const [listingFetchError, setListingFetchError] = useState(null); // Added for fetch errors

  // State for seller contact details
  const [ownerContact, setOwnerContact] = useState(null);
  const [isOwnerContactLoading, setIsOwnerContactLoading] = useState(false);

  // State for messaging
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // State for the Add New Listing Form
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    images: null,
    description: "",
    price: "",
  });

  // ⭐ NEW STATE FOR SEARCH, FILTERS, AND SORTING ⭐
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState(""); // Renamed to avoid clash with form.category
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Default sort

  // ⭐ IMPORTANT: This categories array MUST MATCH THE ENUM IN YOUR BACKEND LISTING MODEL.
  const categories = [
    "Tractors and Machinery",
    "Fertilizers",
    "Crop Seeds",
    "Irrigation Systems",
    "Veggies",
    "More",
  ];

  // ⭐ MODIFIED fetchListings TO USE AXIOS AND ACCEPT QUERY PARAMS ⭐
  const fetchListings = useCallback(async () => {
    setIsLoadingListings(true);
    setListingFetchError(null); // Reset error
    try {
      const config = {
        headers: {
          Authorization: isAuthenticated && user ? `Bearer ${user.token}` : "",
        },
        params: {
          search: searchTerm,
          category: selectedFilterCategory, // Use the filter category
          minPrice: minPrice,
          maxPrice: maxPrice,
          sortBy: sortBy,
        },
      };
      const res = await axios.get(`${API_BASE_URL}/api/listings`, config);

      const processedListings = res.data.map((item) => ({
        ...item,
        firstImageUrl:
          item.images && item.images.length > 0 ? item.images[0] : null,
      }));
      setListings(processedListings);
    } catch (err) {
      console.error(
        "Failed to load listings from backend:",
        err.response ? err.response.data : err.message
      );
      setListingFetchError("Failed to load listings. Please try again.");
      setListings([]); // Clear listings on error
    } finally {
      setIsLoadingListings(false);
    }
  }, [
    isAuthenticated,
    user,
    searchTerm,
    selectedFilterCategory,
    minPrice,
    maxPrice,
    sortBy,
  ]); // Dependencies for useCallback

  // ⭐ Combined useEffect for initial/filtered listing fetch ⭐
  useEffect(() => {
    if (!isAuthLoading) { // Only fetch listings if authentication status is known
      fetchListings();
    }
  }, [isAuthLoading, fetchListings]); // fetchListings is now a dependency due to useCallback


  // Effect for scrolling to hash link (kept as is)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          100
        );
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Effect for fetching owner details (kept as is, but adjusted dependency)
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!user || !user.token) {
        console.log("Cannot fetch owner details: User not logged in or token missing.");
        setOwnerContact(null);
        setIsOwnerContactLoading(false);
        return;
      }

      if (showDetailModal && selectedListing && selectedListing.seller && selectedListing.seller._id) {
        setIsOwnerContactLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/${selectedListing.seller._id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOwnerContact(data);
          } else if (response.status === 401 || response.status === 403) {
            console.error('Authentication failed to fetch owner details:', response.status, response.statusText);
            setOwnerContact(null);
            alert("Authentication failed. Please log in again to view seller details.");
          } else {
            console.error('Failed to fetch owner details:', response.status, response.statusText);
            setOwnerContact(null);
          }
        } catch (error) {
          console.error('Error fetching owner details:', error);
          setOwnerContact(null);
        } finally {
          setIsOwnerContactLoading(false);
        }
      } else {
        setOwnerContact(null);
      }
    };

    if (showDetailModal && selectedListing?.seller?._id) {
      fetchOwnerDetails();
    } else {
      setOwnerContact(null);
    }
  }, [showDetailModal, selectedListing, user]);


  // Grouped listings remain the same, applied to the *filtered* listings
  const grouped = listings.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const toId = (text) =>
    text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("location", form.location);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("price", form.price);

    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        data.append("images", form.images[i]);
      }
    }

    if (!user || !user.token) {
      alert("You must be logged in to upload a listing.");
      console.error("Upload failed: User not logged in or token missing.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        alert("Listing uploaded successfully!");
        setForm({
          title: "",
          location: "",
          category: "",
          images: null,
          description: "",
          price: "",
        });
        fetchListings(); // Re-fetch all listings to update the UI
        setShowAddListingModal(false);
      } else {
        const errorData = await res.json();
        console.error("Upload failed:", errorData);
        alert(
          `Failed to upload listing: ${
            errorData.message || res.statusText
          }. Please ensure you are logged in and all required fields are filled.`
        );
      }
    } catch (error) {
      console.error("Network or unexpected error during upload:", error);
      alert(
        "An unexpected error occurred during upload. Please check your network connection and try again."
      );
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!user || !user.token) {
      alert("You must be logged in to delete listings.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        alert("Listing deleted successfully!");
        fetchListings(); // Re-fetch listings to update UI
      } else if (response.status === 403) {
        alert(
          "You are not authorized to delete this listing. Only the owner can delete it."
        );
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData);
        alert(
          `Failed to delete listing: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("An error occurred while deleting the listing.");
    }
  };

  const openDetailModal = (item) => {
    setSelectedListing(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedListing(null);
    setShowDetailModal(false);
    setOwnerContact(null);
  };

  const openMessageModal = (listing) => {
    if (!user || !user.token) {
      alert("Please log in to send a message.");
      return;
    }
    setSelectedListing(listing);
    setMessageContent("");
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageContent("");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      alert("Message cannot be empty.");
      return;
    }
    if (!user || !user.token) {
      alert("You must be logged in to send a message.");
      return;
    }
    if (!selectedListing || !selectedListing._id) {
      alert("No listing selected to send a message to.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings/${selectedListing._id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ content: messageContent }),
        }
      );

      if (response.ok) {
        alert("Message sent successfully!");
        closeMessageModal();
      } else if (response.status === 401 || response.status === 403) {
        const errorData = await response.json();
        console.error("Authentication failed to send message:", errorData);
        alert(
          `Authentication failed to send message: ${
            errorData.message || response.statusText
          }. Please log in again.`
        );
      } else {
        const errorData = await response.json();
        console.error("Failed to send message:", errorData);
        alert(
          `Failed to send message: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An unexpected error occurred while sending the message.");
    }
  };

  // Function to handle form submission for search/filters
  const handleApplyFilters = (e) => {
    e.preventDefault(); // Prevent page reload
    fetchListings(); // Re-fetch listings with current search/filter/sort parameters
  };

  // Render loading state for auth or listings
  if (isAuthLoading) {
    return (
      <section className="min-h-screen bg-green-50 text-gray-900 px-6 py-12 pt-24 flex items-center justify-center">
        <p className="text-xl">Loading authentication status...</p>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-green-50 py-16 px-4 pt-20">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
            Marketplace
          </h1>

          {/* ⭐ SEARCH AND FILTER SECTION ⭐ */}
          <form onSubmit={handleApplyFilters} className="mb-8 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search Listings</label>
              <input
                type="text"
                id="searchTerm"
                placeholder="e.g., tomatoes, organic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="filterCategory"
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex space-x-2">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {/* Apply Filters Button */}
            <div className="lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </form>
          {/* ⭐ END SEARCH AND FILTER SECTION ⭐ */}

          <nav className="mb-8">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Browse Categories:
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`#${toId(category)}`}
                  className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors shadow-md whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
            </div>
          </nav>

          {user ? (
            <div className="text-center mb-12">
              <button
                onClick={() => setShowAddListingModal(true)}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                + Add New Listing
              </button>
            </div>
          ) : (
            <p className="mb-12 max-w-xl bg-white p-6 rounded shadow text-gray-700 mx-auto">
              <span className="font-medium text-green-700">Tip:</span> You must{" "}
              <Link
                to="/login"
                className="text-green-600 font-semibold underline hover:text-green-800"
              >
                log in
              </Link>{" "}
              or{" "}
              <Link
                to="/join"
                className="text-green-600 font-semibold underline hover:text-green-800"
              >
                create an account
              </Link>{" "}
              to upload your own listings.
            </p>
          )}

          {/* Conditional Rendering based on isLoadingListings state */}
          {isLoadingListings ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
              <p className="mt-4 text-xl text-green-700">Loading listings...</p>
            </div>
          ) : listingFetchError ? (
            <p className="text-center text-red-500 mt-8 text-lg">{listingFetchError}</p>
          ) : Object.entries(grouped).length > 0 ? (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} id={toId(category)} className="mb-16">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                  {category}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="relative p-4 border rounded shadow bg-white hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
                      onClick={() => openDetailModal(item)}
                    >
                      <div>
                        {item.firstImageUrl && (
                          <img
                            src={item.firstImageUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded mb-2"
                          />
                        )}
                        <h3 className="font-semibold text-green-700">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        {/* Display description snippet here, if you want. Removed for now based on your dashboard request. */}
                        {item.description && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{item.description}</p>}
                        {item.price && <p className="text-md font-bold text-green-700 mt-2">{item.price}</p>}
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Category: {item.category}
                        </p>
                      </div>

                      {/* Delete Button for Owners */}
                      {user && item.seller && user._id === item.seller._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteListing(item._id);
                          }}
                          className="mt-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors self-end"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 mt-8">
              No listings available matching your criteria. Be the first to add one!
            </p>
          )}
        </div>
      </section>

      {/* Add New Listing Modal */}
      {showAddListingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-2xl w-full relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={() => setShowAddListingModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-800 mb-6 border-b pb-2">
              Add New Listing
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="listingTitle"
                  type="text"
                  placeholder="e.g., Farm Fresh Eggs, Used Sprayer"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="listingLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  id="listingLocation"
                  type="text"
                  placeholder="e.g., Nairobi, Kisumu"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="listingCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="listingCategory"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="listingDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="listingDescription"
                  placeholder="Provide a detailed description of your item..."
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="listingPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  id="listingPrice"
                  type="text"
                  placeholder="e.g., Ksh 500, Negotiable"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="listingImage" className="block text-sm font-medium text-gray-700 mb-1">Upload Image(s) (Optional - Max 5)</label>
                <input
                  id="listingImage"
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  onChange={(e) => setForm({ ...form, images: e.target.files })}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddListingModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition-colors"
                >
                  Upload Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listing Detail Modal */}
      {showDetailModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-4xl w-full relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-800 mb-6 border-b pb-2">
              {selectedListing.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedListing.firstImageUrl && (
                <div className="md:col-span-1">
                  <img
                    src={selectedListing.firstImageUrl}
                    alt={selectedListing.title}
                    className="w-full object-contain rounded-lg shadow-md max-h-96"
                  />
                </div>
              )}

              <div className="md:col-span-1">
                <p className="text-lg text-gray-700 mb-3">
                  <span className="font-semibold text-green-700">Location:</span>{" "}
                  {selectedListing.location}
                </p>
                <p className="text-lg text-gray-700 mb-3">
                  <span className="font-semibold text-green-700">Category:</span>{" "}
                  {selectedListing.category}
                </p>
                {selectedListing.price && (
                  <p className="text-2xl font-bold text-green-700 mb-4">
                    {selectedListing.price}
                  </p>
                )}

                <h3 className="text-xl font-semibold text-green-800 mb-2 mt-4">Description</h3>
                <p className="text-gray-800 leading-relaxed mb-6">
                  {selectedListing.description || "No description provided."}
                </p>

                <h3 className="text-xl font-semibold text-green-800 mb-2">Seller Information</h3>

                {isOwnerContactLoading ? (
                  <p className="text-gray-600">Loading seller contact details...</p>
                ) : ownerContact ? (
                  <>
                    {ownerContact.name && <p className="text-gray-700 mb-2"><span className="font-semibold text-green-700">Seller Name:</span> {ownerContact.name}</p>}

                    {ownerContact.email && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold text-green-700">Email:</span>{" "}
                        <a href={`mailto:${ownerContact.email}`} className="text-blue-600 hover:underline">
                          {ownerContact.email}
                        </a>
                      </p>
                    )}
                    {ownerContact.phone && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold text-green-700">Phone:</span>{" "}
                        <a href={`tel:${ownerContact.phone}`} className="text-blue-600 hover:underline">
                          {ownerContact.phone}
                        </a>
                      </p>
                    )}
                    {selectedListing.seller && selectedListing.seller._id && (
                        <p className="text-gray-700 mb-2 text-xs"> {/* Reduced font size for ID */}
                            <span className="font-semibold text-green-700">Seller User ID:</span>{" "}
                            {selectedListing.seller._id}
                        </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">Seller contact details not available or failed to load.</p>
                )}

                {user && selectedListing.seller && user._id !== selectedListing.seller._id && (
                  <button
                    onClick={() => openMessageModal(selectedListing)}
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Contact Seller
                  </button>
                )}
                {user && selectedListing.seller && user._id === selectedListing.seller._id && (
                  <p className="mt-4 text-gray-600 italic">This is your listing.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Seller Modal */}
      {showMessageModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={closeMessageModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-800 mb-4 border-b pb-2">
              Message Seller of "{selectedListing.title}"
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 mb-1">Your Message:</label>
                <textarea
                  id="messageContent"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  rows="5"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeMessageModal}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}