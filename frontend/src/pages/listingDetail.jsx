import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // If you need auth for fetching specific listings

function ListingDetail() {
  const { id } = useParams(); // Get the listing ID from the URL
  const { user } = useAuth(); // Assuming you might need user token for fetching
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {};
        // If fetching a specific listing requires authentication, uncomment below:
        // if (user && user.token) {
        //   headers['Authorization'] = `Bearer ${user.token}`;
        // }
        const response = await fetch(`http://localhost:5000/api/listings/${id}`, { headers });
        if (!response.ok) {
          throw new Error(`Failed to fetch listing: ${response.statusText}`);
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, user]); // Include user if its token is used for fetch

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading listing...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center">Listing not found.</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 pt-20">
        <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">{listing.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Display all images or just the first one */}
                {listing.images && listing.images.length > 0 && (
                    <div className="md:col-span-1">
                        {/* You might want a carousel here for multiple images */}
                        <img
                            src={listing.images[0]} // Display the first image
                            alt={listing.title}
                            className="w-full h-96 object-contain rounded-lg shadow-md"
                        />
                        {/* If you have more images, you can render them as thumbnails below */}
                        <div className="flex space-x-2 mt-2 overflow-x-auto">
                            {listing.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${listing.title} thumbnail ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-green-500"
                                    // onClick function to change main image if carousel is implemented
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="md:col-span-1">
                    <p className="text-lg text-gray-700 mb-2"><span className="font-semibold text-green-700">Location:</span> {listing.location}</p>
                    <p className="text-lg text-gray-700 mb-2"><span className="font-semibold text-green-700">Category:</span> {listing.category}</p>
                    <p className="text-xl font-bold text-green-700 mb-4">{listing.price}</p>

                    <h2 className="text-2xl font-semibold text-green-800 mt-6 mb-2">Description:</h2>
                    <p className="text-gray-800 leading-relaxed mb-6">{listing.description}</p>

                    {/* Seller information can be displayed here, similar to Marketplace detail modal */}
                    {listing.seller && (
                        <>
                            <h3 className="text-xl font-semibold text-green-800 mb-2">Seller:</h3>
                            <p className="text-gray-700 mb-1"><span className="font-semibold">Name:</span> {listing.seller.name}</p>
                            <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> <a href={`mailto:${listing.seller.email}`} className="text-blue-600 hover:underline">{listing.seller.email}</a></p>
                            {listing.seller.phone && <p className="text-gray-700 mb-1"><span className="font-semibold">Phone:</span> <a href={`tel:${listing.seller.phone}`} className="text-blue-600 hover:underline">{listing.seller.phone}</a></p>}
                        </>
                    )}

                    {/* Optionally add a "Contact Seller" button here */}
                </div>
            </div>
        </div>
    </section>
  );
}

export default ListingDetail;