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
  CheckCircle2,
  Clock,
  RefreshCw,
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

  const stats = [
    { name: "Live Products", value: `${liveCount}`, sub: `${draftCount} drafts in catalog`, icon: Package, color: "text-emerald-700 bg-emerald-50" },
    { name: "Total Variants", value: `${totalVariants}`, sub: "Lengths & textures configured", icon: TrendingUp, color: "text-champagne-dark bg-champagne/15" },
    { name: "Orders", value: "0", sub: "Ready for live checkout", icon: ShoppingBag, color: "text-blue-700 bg-blue-50" },
    { name: "Store Visits", value: "Active", sub: "Storefront live & accessible", icon: Users, color: "text-purple-700 bg-purple-50" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-obsidian tracking-tight">Admin Overview</h1>
          <p className="text-sm text-taupe mt-1">
            Welcome to your Julesbraids & Hair management console.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-taupe/20 bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm hover:bg-warm-white transition"
          >
            <Eye className="h-4 w-4 text-taupe" />
            View Storefront
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-obsidian px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-charcoal transition"
          >
            <PlusCircle className="h-4 w-4 text-champagne" />
            Upload Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl border border-taupe/20 bg-white p-6 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-taupe">
                  {stat.name}
                </span>
                <div className={`rounded-md p-2.5 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-serif font-medium text-obsidian">
                {stat.value}
              </div>
              <p className="text-xs text-taupe mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-taupe/20 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-taupe/10 pb-4">
            <div>
              <h2 className="text-lg font-serif font-medium text-obsidian">Recent Products</h2>
              <p className="text-xs text-taupe mt-0.5">Manage products or view them live on your store.</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-wider text-obsidian hover:text-champagne flex items-center gap-1 transition"
            >
              View Catalog <ArrowRight className="h-3.5 w-3.5" />
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
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-10 rounded overflow-hidden bg-taupe/10 border border-taupe/15 shrink-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
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
                      <div className="flex items-center gap-2 text-xs text-taupe mt-0.5">
                        <span className="font-medium text-obsidian">{formatCurrency(p.basePrice)}</span>
                        <span>•</span>
                        <span>{p.productType}</span>
                        <span>•</span>
                        <span>{p.variants?.length || 0} lengths</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
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
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel (1 Col) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-xs space-y-4">
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
                  <p className="text-[11px] text-taupe">Add images, prices & inch variants</p>
                </div>
                <PlusCircle className="h-4 w-4 text-taupe group-hover:text-obsidian" />
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Manage Inventory
                  </p>
                  <p className="text-[11px] text-taupe">View full catalog & update stock</p>
                </div>
                <ArrowRight className="h-4 w-4 text-taupe group-hover:text-obsidian" />
              </Link>

              <Link
                href="/shop"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-lg border border-taupe/20 hover:border-obsidian hover:bg-warm-white/50 transition group"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-obsidian group-hover:text-champagne">
                    Customer Storefront
                  </p>
                  <p className="text-[11px] text-taupe">Preview live customer catalog</p>
                </div>
                <ExternalLink className="h-4 w-4 text-taupe group-hover:text-obsidian" />
              </Link>
            </div>
          </div>

          {/* Store Status Card */}
          <div className="rounded-xl border border-champagne/30 bg-champagne/10 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-obsidian">
                Catalog Engine Ready
              </span>
            </div>
            <p className="text-xs text-charcoal/80 leading-relaxed">
              Products uploaded via the admin panel are saved immediately and appear in the customer storefront and search.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
