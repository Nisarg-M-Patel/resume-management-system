'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Entry } from '../models/Entry';
import { entriesApi } from '../lib/api';

export default function DashboardPage() {
  const [highlights, setHighlights] = useState<Entry[]>([]);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get highlighted entries
        const highlightedEntries = await entriesApi.getHighlights();
        setHighlights(highlightedEntries);
        
        // Get all entries and sort by created date for recent entries
        const allEntries = await entriesApi.getAll();
        const sortedEntries = [...allEntries].sort((a, b) => {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
        setRecentEntries(sortedEntries.slice(0, 5)); // Get top 5 recent entries
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highlighted Entries Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Highlighted Entries</h2>
            <Link href="/entries?highlight=true" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {highlights.length === 0 ? (
            <p className="text-gray-500">No highlighted entries yet.</p>
          ) : (
            <ul className="space-y-2">
              {highlights.map((entry) => (
                <li key={entry.id} className="border-b pb-2">
                  <Link href={`/entries/${entry.id}`} className="hover:text-blue-600">
                    <span className="font-medium">{entry.title}</span>
                    <span className="block text-sm text-gray-600">
                      {entry.organization} • {entry.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Recent Entries Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Entries</h2>
            <Link href="/entries" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {recentEntries.length === 0 ? (
            <p className="text-gray-500">No entries yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentEntries.map((entry) => (
                <li key={entry.id} className="border-b pb-2">
                  <Link href={`/entries/${entry.id}`} className="hover:text-blue-600">
                    <span className="font-medium">{entry.title}</span>
                    <span className="block text-sm text-gray-600">
                      {entry.type} • Added {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            href="/entries/new" 
            className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition"
          >
            Add New Entry
          </Link>
          <Link 
            href="/resumes" 
            className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition"
          >
            Generate Resume
          </Link>
          <Link 
            href="/entries"
            className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition"
          >
            Manage Entries
          </Link>
        </div>
      </div>
    </div>
  );
}