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
} from "lucide-react";

const navigation = [
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

  return (
    <div className="flex h-full w-64 flex-col border-r border-taupe/20 bg-warm-white">
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
            <span className="text-[10px] uppercase tracking-widest text-taupe block">
              Admin Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 pb-2">
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 w-full rounded-md bg-obsidian py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-charcoal transition"
        >
          <PlusCircle className="h-4 w-4 text-champagne" />
          Upload Product
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-obsidian text-white shadow-xs font-semibold"
                  : "text-charcoal hover:bg-taupe/10 hover:text-obsidian"
              }`}
            >
              <Icon
                className={`mr-3 h-4 w-4 flex-shrink-0 transition ${
                  isActive ? "text-champagne" : "text-taupe group-hover:text-obsidian"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Storefront Quick Link & User Profile */}
      <div className="border-t border-taupe/20 p-4 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs font-medium text-taupe hover:text-obsidian py-1.5 px-2 rounded hover:bg-taupe/10 transition"
        >
          <span className="flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            View Storefront
          </span>
          <span className="text-[10px] uppercase font-mono bg-taupe/15 px-1.5 py-0.5 rounded text-charcoal">
            Live
          </span>
        </Link>

        <div className="flex items-center pt-2 border-t border-taupe/15">
          <div className="h-8 w-8 rounded-full bg-champagne text-white flex items-center justify-center font-serif text-sm font-bold">
            A
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-xs font-semibold text-obsidian truncate">Jules Hair Admin</p>
            <p className="text-[11px] text-taupe truncate">admin@julesbraids.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
