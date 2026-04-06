"use client";

import { error } from "console";
import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  console.error("Page error:", error);
  
  return (
    <div className="min-h-screen bg-[#faf8fe] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#2e323d] mb-2">Something went wrong</h1>
        <p className="text-[#5b5f6b] mb-6">
          We encountered an error. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#005cbb] text-white rounded-xl font-medium hover:bg-[#004a9a] transition-colors"
        >
          Try again
        </button>
        <br /><br />
        <a href="/login" className="text-[#005cbb] hover:underline">
          Go to login
        </a>
      </div>
    </div>
  );
}
