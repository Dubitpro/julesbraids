"use client";

import Link from "next/link";
import { ExternalLink, Plus, Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-taupe/20 bg-warm-white px-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-taupe hidden sm:inline-block">
          JulesBraids &amp; Hairs Merchant Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md border border-taupe/25 bg-white px-3 py-1.5 text-xs font-medium text-charcoal hover:text-obsidian hover:bg-taupe/10 transition"
        >
          <ExternalLink className="h-3.5 w-3.5 text-taupe" />
          <span>Live Store</span>
        </Link>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-obsidian px-3.5 py-1.5 text-xs font-medium text-white hover:bg-charcoal transition"
        >
          <Plus className="h-3.5 w-3.5 text-champagne" />
          <span>New Product</span>
        </Link>
      </div>
    </header>
  );
}
