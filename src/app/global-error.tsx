'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] p-6 text-center font-sans text-[#1A1A1A]">
        <div className="max-w-md rounded-lg border border-black/10 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-serif font-semibold mb-3">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-6 font-light">
            An unexpected error occurred. Please try reloading the application.
          </p>
          <button
            onClick={() => reset()}
            className="rounded bg-black px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
