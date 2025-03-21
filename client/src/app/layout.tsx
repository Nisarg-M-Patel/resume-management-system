// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

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
      <body className="bg-gray-100 min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              Resume Management
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-gray-300">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/entries" className="hover:text-gray-300">
                    Entries
                  </Link>
                </li>
                <li>
                  <Link href="/resumes" className="hover:text-gray-300">
                    Resumes
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 pt-8">
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