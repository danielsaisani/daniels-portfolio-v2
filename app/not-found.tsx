'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h2 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
            404
          </h2>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-white mb-2">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <p className="text-white text-sm mb-8">
          The page might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all hover:shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
} 