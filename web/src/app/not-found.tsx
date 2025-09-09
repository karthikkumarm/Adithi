export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-apple-gray-600">The page you are looking for does not exist.</p>
        <a href="/" className="inline-block mt-4 h-10 px-4 rounded-xl bg-apple-blue text-white">Go Home</a>
      </div>
    </div>
  );
}

