"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ExternalLink,
  Tags,
  Layers,
  Archive,
  ShoppingBag,
  Users,
  Settings,
  X,
  Store,
} from "lucide-react";
import { useAdminLayout } from "./AdminLayoutContext";

export const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", href: "/admin/products", icon: Package, exact: false },
  { name: "Categories", href: "/admin/categories", icon: Tags, exact: false },
  { name: "Collections", href: "/admin/collections", icon: Layers, exact: false },
  { name: "Inventory", href: "/admin/inventory", icon: Archive, exact: false },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag, exact: false },
  { name: "Customers", href: "/admin/customers", icon: Users, exact: false },
  { name: "Settings", href: "/admin/settings", icon: Settings, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useAdminLayout();

  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
      {adminNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-obsidian text-white shadow-sm font-semibold"
                : "text-charcoal hover:bg-taupe/10 hover:text-obsidian"
            }`}
          >
            <Icon
              className={`mr-3 h-4 w-4 shrink-0 transition ${
                isActive ? "text-champagne" : "text-taupe group-hover:text-obsidian"
              }`}
            />
            <span className="flex-1 truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderFooter = () => (
    <div className="border-t border-taupe/20 p-4 space-y-3 bg-warm-white">
      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-between text-xs font-medium text-taupe hover:text-obsidian py-2 px-2.5 rounded-md hover:bg-taupe/10 transition"
      >
        <span className="flex items-center gap-2">
          <Store className="h-3.5 w-3.5 text-champagne" />
          View Storefront
        </span>
        <span className="text-[10px] uppercase font-mono bg-taupe/15 px-1.5 py-0.5 rounded text-charcoal">
          Live
        </span>
      </Link>

      <div className="flex items-center pt-2 border-t border-taupe/15">
        <div className="h-9 w-9 rounded-full bg-champagne text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0">
          JB
        </div>
        <div className="ml-3 min-w-0">
          <p className="text-xs font-semibold text-obsidian truncate">Jules Hair Admin</p>
          <p className="text-[11px] text-taupe truncate">admin@julesbraids.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-r lg:border-taupe/20 lg:bg-warm-white lg:shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-taupe/20 px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="JulesBraids & Hairs"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-champagne/40 shrink-0"
            />
            <div>
              <span className="font-serif text-sm tracking-tight text-obsidian block leading-tight font-medium">
                JulesBraids &amp; Hairs
              </span>
              <span className="text-[10px] uppercase tracking-widest text-taupe block font-sans">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Primary Action Button */}
        <div className="p-4 pb-2">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 w-full rounded-md bg-obsidian py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-charcoal transition active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4 text-champagne" />
            Upload Product
          </Link>
        </div>

        {/* Navigation Links */}
        {renderNavLinks()}

        {/* Footer */}
        {renderFooter()}
      </aside>

      {/* ================= MOBILE SLIDE-OVER DRAWER ================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            onClick={closeSidebar}
            aria-label="Close admin menu"
          />

          {/* Drawer content */}
          <div className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col bg-warm-white shadow-2xl border-r border-taupe/20 transform transition-transform duration-300 ease-in-out">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-taupe/20 px-5">
              <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-2.5">
                <img
                  src="/logo.jpg"
                  alt="JulesBraids & Hairs"
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-champagne/40 shrink-0"
                />
                <div>
                  <span className="font-serif text-sm font-medium text-obsidian block leading-tight">
                    JulesBraids &amp; Hairs
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-taupe block">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={closeSidebar}
                className="rounded-lg p-2 text-taupe hover:text-obsidian hover:bg-taupe/10 transition"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upload Product Button */}
            <div className="p-4 pb-2">
              <Link
                href="/admin/products/new"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-2 w-full rounded-md bg-obsidian py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-charcoal transition active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4 text-champagne" />
                Upload Product
              </Link>
            </div>

            {/* Navigation links */}
            {renderNavLinks(closeSidebar)}

            {/* Footer */}
            {renderFooter()}
          </div>
        </div>
      )}
    </>
  );
}
