"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  const isAuthError = error.message?.includes("auth") || error.message?.includes("login");
  
  return (
    <div className="min-h-screen bg-[#faf8fe] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#2e323d] mb-2">
          {isAuthError ? "Authentication Required" : "Something went wrong"}
        </h1>
        <p className="text-[#5b5f6b] mb-4">
          {isAuthError 
            ? "Please log in to access this page." 
            : "We encountered an error. Please try again."}
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 text-left overflow-auto">
            <code>{error.message}</code>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#005cbb] text-white rounded-xl font-medium hover:bg-[#004a9a] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href={isAuthError ? "/login" : "/dashboard"}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#aeb1bf]/30 text-[#5b5f6b] rounded-xl font-medium hover:bg-[#f3f3fb] transition-colors"
          >
            <Home className="w-4 h-4" />
            {isAuthError ? "Go to login" : "Go to dashboard"}
          </Link>
        </div>
      </div>
    </div>
  );
}
