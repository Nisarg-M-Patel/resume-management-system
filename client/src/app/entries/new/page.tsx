// src/app/entries/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryForm from '../../../components/EntryForm';
import { Entry } from '../../../models/Entry';
import { entriesApi } from '../../../lib/api';

export default function NewEntryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Entry) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await entriesApi.create(data);
      router.push('/entries');
      router.refresh();
    } catch (err: any) {
      console.error('Failed to create entry:', err);
      setError(err.response?.data?.message || 'Failed to create entry');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/entries');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Entry</h1>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <EntryForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
}