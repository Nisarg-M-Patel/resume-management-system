'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Entry } from '../../../models/Entry';
import { entriesApi } from '../../../lib/api';
import { format } from 'date-fns';

interface EntryDetailPageProps {
  params: {
    id: string;
  };
}

export default function EntryDetailPage({ params }: EntryDetailPageProps) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
          setError('Invalid entry ID');
          setLoading(false);
          return;
        }
        
        const entryData = await entriesApi.getById(id);
        setEntry(entryData);
      } catch (err: any) {
        console.error('Failed to fetch entry:', err);
        setError(err.response?.data?.message || 'Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params.id]);

  const handleDelete = async () => {
    if (!entry || !entry.id) return;
    
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await entriesApi.delete(entry.id);
        router.push('/entries');
        router.refresh();
      } catch (err) {
        console.error('Failed to delete entry:', err);
        alert('Failed to delete entry');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/entries" className="text-blue-600 hover:underline">
          Return to Entries
        </Link>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <p className="text-yellow-600 mb-4">Entry not found</p>
        <Link href="/entries" className="text-blue-600 hover:underline">
          Return to Entries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{entry.title}</h1>
        <div className="space-x-2">
          <Link 
            href={`/entries/${entry.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Type:</span> {entry.type}
              </p>
              {entry.organization && (
                <p>
                  <span className="font-medium">Organization:</span> {entry.organization}
                </p>
              )}
              {entry.location && (
                <p>
                  <span className="font-medium">Location:</span> {entry.location}
                </p>
              )}
              <p>
                <span className="font-medium">Date Range:</span>{' '}
                {format(new Date(entry.startDate), 'MMM yyyy')} - 
                {entry.endDate 
                  ? format(new Date(entry.endDate), 'MMM yyyy')
                  : 'Present'}
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {entry.keywords && entry.keywords.length > 0 ? (
                entry.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No keywords added</p>
              )}
            </div>
          </div>
        </div>
        
        {entry.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{entry.description}</p>
          </div>
        )}
        
        {entry.bullets && entry.bullets.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Bullet Points</h2>
            <ul className="list-disc list-inside space-y-1">
              {entry.bullets.map((bullet, index) => (
                <li key={index} className="text-gray-700">{bullet}</li>
              ))}
            </ul>
          </div>
        )}
        
        {entry.urls && entry.urls.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Links</h2>
            <ul className="space-y-1">
              {entry.urls.map((urlItem, index) => (
                <li key={index}>
                  <a 
                    href={urlItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {urlItem.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Link href="/entries" className="text-blue-600 hover:underline">
          ← Back to Entries
        </Link>
      </div>
    </div>
  );
}