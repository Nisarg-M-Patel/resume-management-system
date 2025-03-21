'use client';

import { useState } from 'react';
import axios from 'axios';
import { Entry } from '../../models/Entry';
import Link from 'next/link';
import { format } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function ResumesPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [matchedEntries, setMatchedEntries] = useState<Entry[]>([]);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'review', 'final'
  
  const handleGenerateResume = async () => {
    if (!jobDescription.trim()) return;
    
    setLoading(true);
    try {
      // Extract keywords first
      const keywordsResponse = await axios.post(`${API_BASE_URL}/resumes/extract-keywords`, {
        jobDescription
      });
      
      setExtractedKeywords(keywordsResponse.data);
      
      // Generate tailored resume
      const resumeResponse = await axios.post(`${API_BASE_URL}/resumes/generate`, {
        jobDescription,
        maxEntries: 10
      });
      
      setMatchedEntries(resumeResponse.data);
      setStep('review');
    } catch (error) {
      console.error('Failed to generate resume:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinalize = () => {
    setStep('final');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Generate Tailored Resume</h1>
      
      {step === 'input' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Job Description</h2>
            <p className="text-gray-600 mb-4">
              Paste a job description to generate a custom resume with relevant experience and skills.
            </p>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border rounded-lg h-64"
              placeholder="Paste job description here..."
            />
          </div>
          
          <button
            onClick={handleGenerateResume}
            disabled={loading || !jobDescription.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      )}
      
      {step === 'review' && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Extracted Keywords</h2>
            
            {extractedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {extractedKeywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No keywords extracted.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Selected Entries ({matchedEntries.length})</h2>
            
            {matchedEntries.length > 0 ? (
              <div className="space-y-4">
                {matchedEntries.map((entry) => (
                  <div key={entry.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{entry.title}</h3>
                      <Link 
                        href={`/entries/${entry.id}/edit`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                    
                    <p className="text-gray-700">
                      {entry.organization} • {entry.location}
                    </p>
                    
                    <p className="text-gray-600 text-sm">
                      {entry.startDate && format(new Date(entry.startDate), 'MMM yyyy')} - 
                      {entry.endDate 
                        ? format(new Date(entry.endDate), 'MMM yyyy')
                        : 'Present'}
                    </p>
                    
                    {entry.bullets && entry.bullets.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {entry.bullets.map((bullet, i) => (
                          <li key={i} className="text-gray-700">{bullet}</li>
                        ))}
                      </ul>
                    )}
                    
                    {entry.keywords && entry.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.keywords.map((keyword, i) => (
                          <span 
                            key={i} 
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No entries matched the job description.</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep('input')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Edit
            </button>
            
            <button
              onClick={handleFinalize}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Finalize Resume
            </button>
          </div>
        </div>
      )}
      
      {step === 'final' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Tailored Resume</h2>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Print/Save PDF
            </button>
          </div>
          
          <div className="resume-container">
            <h1 className="text-2xl font-bold text-center mb-4">Professional Resume</h1>
            
            {/* Skills section based on keywords */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {extractedKeywords.map((keyword, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{keyword}</span>
                ))}
              </div>
            </div>
            
            {/* Group entries by type */}
            {['EXPERIENCE', 'EDUCATION', 'PROJECT', 'SKILL'].map(type => {
              const entriesOfType = matchedEntries.filter(e => e.type === type);
              if (entriesOfType.length === 0) return null;
              
              return (
                <div key={type} className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </h2>
                  
                  <div className="space-y-4">
                    {entriesOfType.map(entry => (
                      <div key={entry.id}>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{entry.title}</h3>
                          <span className="text-gray-600 text-sm">
                            {entry.startDate && format(new Date(entry.startDate), 'MMM yyyy')} - 
                            {entry.endDate 
                              ? format(new Date(entry.endDate), 'MMM yyyy')
                              : 'Present'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 text-sm">
                          {entry.organization}{entry.location ? ` • ${entry.location}` : ''}
                        </p>
                        
                        {entry.bullets && entry.bullets.length > 0 && (
                          <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                            {entry.bullets.map((bullet, i) => (
                              <li key={i} className="text-gray-700">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => setStep('review')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}