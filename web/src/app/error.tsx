"use client";
import * as React from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-6 max-w-md text-center">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-apple-gray-600">An unexpected error occurred.</p>
          <div className="mt-4">
            <button className="h-10 px-4 rounded-xl bg-apple-blue text-white" onClick={() => reset()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}

