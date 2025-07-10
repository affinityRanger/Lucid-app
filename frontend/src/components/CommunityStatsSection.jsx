// frontend/src/components/CommunityStatsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommunityStatCard from './CommunityStatCard'; 

export default function CommunityStatsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/community/stats');
        setStats(response.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching community stats:', err.response?.data || err.message);
        setError('Failed to load community statistics.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  if (loading) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300 py-8">
        Loading community stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-8 max-w-2xl" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300 py-8">
        No statistics available.
      </div>
    );
  }

  return (
    <div className="my-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">Community Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Render multiple Stat Cards based on fetched data */}
        <CommunityStatCard number={stats.totalUsers || 0} label="Total Members" />
        <CommunityStatCard number={stats.totalDiscussions || 0} label="Total Discussions" />
        {/* You can add more stat cards here as your backend provides more data */}
        {/* <CommunityStatCard number={stats.activeUsers || 0} label="Active Users" /> */}
      </div>
    </div>
  );
}