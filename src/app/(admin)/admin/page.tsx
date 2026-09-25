"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Eye,
  RefreshCw,
  Archive,
  Layers,
  Tags,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  productType: string;
  images: string[];
  variants: any[];
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = products.length;
  const liveCount = products.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
  const lowStockCount = products.filter((p) =>
    p.variants?.some((v: any) => Number(v.stock) > 0 && Number(v.stock) <= 5)
  ).length;

  const stats = [
    {
      name: "Live Products",
      value: `${liveCount}`,
      sub: `${draftCount} drafts in catalog`,
      icon: Package,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      name: "Hair Variants",
      value: `${totalVariants}`,
      sub: "Lengths & textures active",
      icon: TrendingUp,
      color: "text-champagne bg-champagne/15",
    },
    {
      name: "Low Stock Items",
      value: `${lowStockCount}`,
      sub: "Variants needing restock",
      icon: AlertTriangle,
      color: "text-amber-700 bg-amber-50",
    },
    {
      name: "Store Status",
      value: "Live",
      sub: "Storefront online & accessible",
      icon: CheckCircle2,
      color: "text-blue-700 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Manage your JulesBraids &amp; Hairs luxury inventory, orders, and catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-taupe/20 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-charcoal shadow-2xs hover:bg-warm-white transition active:scale-[0.98]"
          >
            <Eye className="h-4 w-4 text-taupe" />
            <span>Storefront</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-obsidian px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4 text-champagne" />
            <span>Upload Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
                  {stat.name}
                </span>
                <div className={`rounded-md p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-2 text-xl sm:text-2xl font-serif font-medium text-obsidian">
                {stat.value}
              </div>
              <p className="text-[11px] text-taupe mt-0.5 line-clamp-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Access Tiles for Mobile & Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/products"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-taupe/20 bg-white hover:border-obsidian hover:shadow-2xs transition text-center group"
        >
          <Package className="h-5 w-5 text-taupe group-hover:text-obsidian mb-1.5" />
          <span className="text-xs font-semibold text-obsidian group-hover:text-champagne">
            Catalog
          </span>
          <span className="text-[10px] text-taupe">{totalProducts} Products</span>
        </Link>

        <Link
          href="/admin/inventory"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-taupe/20 bg-white hover:border-obsidian hover:shadow-2xs transition text-center group"
        >
          <Archive className="h-5 w-5 text-taupe group-hover:text-obsidian mb-1.5" />
          <span className="text-xs font-semibold text-obsidian group-hover:text-champagne">
            Inventory
          </span>
          <span className="text-[10px] text-taupe">{totalVariants} Variants</span>
        </Link>

        <Link
          href="/admin/categories"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-taupe/20 bg-white hover:border-obsidian hover:shadow-2xs transition text-center group"
        >
          <Tags className="h-5 w-5 text-taupe group-hover:text-obsidian mb-1.5" />
          <span className="text-xs font-semibold text-obsidian group-hover:text-champagne">
            Categories
          </span>
          <span className="text-[10px] text-taupe">6 Classifications</span>
        </Link>

        <Link
          href="/admin/orders"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-taupe/20 bg-white hover:border-obsidian hover:shadow-2xs transition text-center group"
        >
          <ShoppingBag className="h-5 w-5 text-taupe group-hover:text-obsidian mb-1.5" />
          <span className="text-xs font-semibold text-obsidian group-hover:text-champagne">
            Orders
          </span>
          <span className="text-[10px] text-taupe">Manage Sales</span>
        </Link>
      </div>

      {/* Main Content Grid: Recent Products (2 Cols) & Quick Shortcuts (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Products (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-taupe/20 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-taupe/10 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-medium text-obsidian">
                Recent Products
              </h2>
              <p className="text-xs text-taupe mt-0.5">
                Quickly edit items or preview on your customer storefront.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-wider text-obsidian hover:text-champagne flex items-center gap-1 transition"
            >
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-taupe">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-taupe" />
              <p className="text-xs">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-10 w-10 text-taupe/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal">No products uploaded yet</p>
              <Link
                href="/admin/products/new"
                className="mt-3 inline-flex items-center rounded-md bg-obsidian px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Upload First Product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-taupe/10">
              {products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-11 rounded overflow-hidden bg-taupe/10 border border-taupe/15 shrink-0">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[9px] text-taupe">
                          No Pic
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-sm font-medium text-obsidian hover:text-champagne truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-taupe mt-0.5">
                        <span className="font-semibold text-obsidian">
                          {formatCurrency(p.basePrice)}
                        </span>
                        <span>•</span>
                        <span>{p.productType}</span>
                        <span>•</span>
                        <span>{p.variants?.length || 0} lengths</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t border-taupe/5 sm:border-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 text-xs text-charcoal hover:text-obsidian hover:bg-taupe/10 rounded transition"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-taupe hover:text-obsidian hover:bg-taupe/10 rounded transition"
                        title="View on store"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel (1 Col) */}
        <div className="space-y-5">
          <div className="rounded-xl border border-taupe/20 bg-white p-5 shadow-2xs space-y-4">
            <h2 className="text-base font-serif font-medium text-obsidian border-b border-taupe/10 pb-3">
              Quick Shortcuts
            </h2>

            <div className="space-y-2.5">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Upload New Product
                  </p>
                  <p className="text-[11px] text-taupe">Add images, prices &amp; inch variants</p>
                </div>
                <PlusCircle className="h-4 w-4 text-taupe group-hover:text-obsidian shrink-0" />
              </Link>

              <Link
                href="/admin/inventory"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Live Inventory Stock
                  </p>
                  <p className="text-[11px] text-taupe">Update counts across lengths</p>
                </div>
                <Archive className="h-4 w-4 text-taupe group-hover:text-obsidian shrink-0" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Order Center
                  </p>
                  <p className="text-[11px] text-taupe">Fulfill and track customer purchases</p>
                </div>
                <ShoppingBag className="h-4 w-4 text-taupe group-hover:text-obsidian shrink-0" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Store Settings
                  </p>
                  <p className="text-[11px] text-taupe">Shipping, policies &amp; branding</p>
                </div>
                <ArrowRight className="h-4 w-4 text-taupe group-hover:text-obsidian shrink-0" />
              </Link>
            </div>
          </div>

          {/* Store Status Card */}
          <div className="rounded-xl border border-champagne/30 bg-champagne/10 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">
                Catalog Engine Synchronized
              </span>
            </div>
            <p className="text-xs text-charcoal/80 leading-relaxed">
              All inventory and product modifications are instantly indexed and rendered on the live JulesBraids &amp; Hairs customer storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
