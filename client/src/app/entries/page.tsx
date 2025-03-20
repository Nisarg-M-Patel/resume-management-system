// src/app/entries/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { entriesApi } from '../../lib/api';
import { Entry, EntryType } from '../../models/Entry';
import Link from 'next/link';
import { format } from 'date-fns';

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EntryType | 'ALL'>('ALL');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        let data: Entry[];
        if (filter === 'ALL') {
          data = await entriesApi.getAll();
        } else {
          data = await entriesApi.getByType(filter);
        }
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await entriesApi.delete(id);
        setEntries(entries.filter(entry => entry.id !== id));
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Entries</h1>
        <Link 
          href="/entries/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Entry
        </Link>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter by type:</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as EntryType | 'ALL')}
          className="border rounded p-2"
        >
          <option value="ALL">All Types</option>
          <option value="EXPERIENCE">Experience</option>
          <option value="PROJECT">Project</option>
          <option value="EDUCATION">Education</option>
          <option value="SKILL">Skill</option>
        </select>
      </div>

      {entries.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">
          No entries found. Get started by adding a new entry.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{entry.title}</h2>
                {entry.highlight && (
                  <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                    Highlight
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mt-1">
                {entry.organization && `${entry.organization} • `}
                {entry.location}
              </p>
              
              <p className="text-gray-500 text-sm mt-1">
                {entry.startDate && format(new Date(entry.startDate), 'MMM yyyy')} - 
                {entry.endDate 
                  ? format(new Date(entry.endDate), 'MMM yyyy')
                  : 'Present'}
              </p>
              
              {entry.keywords.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {entry.keywords.map((keyword, i) => (
                      <span 
                        key={i} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex space-x-2">
                <Link 
                  href={`/entries/${entry.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link 
                  href={`/entries/${entry.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(entry.id!)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}