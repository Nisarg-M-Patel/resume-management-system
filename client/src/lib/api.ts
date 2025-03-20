// src/lib/api.ts

import axios from 'axios';
import { Entry } from '../models/Entry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const entriesApi = {
  // Get all entries
  getAll: async (): Promise<Entry[]> => {
    const response = await api.get('/entries');
    return response.data;
  },
  
  // Get entry by ID
  getById: async (id: number): Promise<Entry> => {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },
  
  // Get entries by type
  getByType: async (type: string): Promise<Entry[]> => {
    const response = await api.get(`/entries/type/${type}`);
    return response.data;
  },
  
  // Get highlighted entries
  getHighlights: async (): Promise<Entry[]> => {
    const response = await api.get('/entries/highlights');
    return response.data;
  },
  
  // Search entries by keywords
  searchByKeywords: async (keywords: string[]): Promise<Entry[]> => {
    const params = new URLSearchParams();
    keywords.forEach(keyword => params.append('keywords', keyword));
    const response = await api.get(`/entries/search?${params.toString()}`);
    return response.data;
  },
  
  // Create new entry
  create: async (entry: Entry): Promise<Entry> => {
    const response = await api.post('/entries', entry);
    return response.data;
  },
  
  // Update entry
  update: async (id: number, entry: Entry): Promise<Entry> => {
    const response = await api.put(`/entries/${id}`, entry);
    return response.data;
  },
  
  // Delete entry
  delete: async (id: number): Promise<void> => {
    await api.delete(`/entries/${id}`);
  }
};