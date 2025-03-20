// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Management App',
  description: 'Manage your resume entries and generate targeted resumes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Resume Management</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:text-gray-300">Dashboard</a></li>
                <li><a href="/entries" className="hover:text-gray-300">Entries</a></li>
                <li><a href="/resumes" className="hover:text-gray-300">Resumes</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-200 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>Resume Management App © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}