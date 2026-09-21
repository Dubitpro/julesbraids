import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-6 text-center">
      <h1 className="text-6xl font-serif text-obsidian tracking-tight mb-4">404</h1>
      <h2 className="text-xl font-serif text-charcoal mb-2">Page Not Found</h2>
      <p className="text-sm text-taupe max-w-md mb-8">
        The luxury hair piece or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-obsidian px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition"
      >
        Return to Boutique
      </Link>
    </div>
  );
}
