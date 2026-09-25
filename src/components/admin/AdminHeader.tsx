"use client";

import Link from "next/link";
import { ExternalLink, Plus, Menu, Eye } from "lucide-react";
import { useAdminLayout } from "./AdminLayoutContext";

export function AdminHeader() {
  const { toggleSidebar } = useAdminLayout();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-taupe/20 bg-warm-white px-4 sm:px-6 z-20">
      {/* Left side: Hamburger toggle on mobile + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal hover:text-obsidian hover:bg-taupe/10 transition lg:hidden"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <Link href="/admin" className="flex items-center gap-2 lg:hidden">
            <img
              src="/logo.jpg"
              alt="JulesBraids & Hairs"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-champagne/40"
            />
            <span className="font-serif text-sm font-medium text-obsidian tracking-tight">
              JulesBraids
            </span>
          </Link>

          <span className="text-xs font-semibold uppercase tracking-widest text-taupe hidden lg:inline-block">
            JulesBraids &amp; Hairs Merchant Portal
          </span>
        </div>
      </div>

      {/* Right side: Quick Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md border border-taupe/25 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-charcoal hover:text-obsidian hover:bg-taupe/10 transition shadow-2xs"
          title="View Live Storefront"
        >
          <Eye className="h-3.5 w-3.5 text-taupe" />
          <span className="hidden xs:inline">Live Store</span>
        </Link>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-obsidian px-3 sm:px-3.5 py-1.5 text-xs font-medium text-white hover:bg-charcoal transition shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5 text-champagne" />
          <span>New Product</span>
        </Link>
      </div>
    </header>
  );
}
