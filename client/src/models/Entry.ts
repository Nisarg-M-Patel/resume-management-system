// src/models/Entry.ts

export type EntryType = 'EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'SKILL';

export interface Url {
  title: string;
  url: string;
}

export interface Entry {
  id?: number;
  title: string;
  type: EntryType;
  organization?: string;
  location?: string;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string or null for "present"
  description?: string;
  bullets: string[];
  keywords: string[];
  urls: Url[];
  highlight: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const emptyEntry: Entry = {
  title: '',
  type: 'EXPERIENCE',
  startDate: new Date().toISOString().split('T')[0],
  bullets: [],
  keywords: [],
  urls: [],
  highlight: false
};