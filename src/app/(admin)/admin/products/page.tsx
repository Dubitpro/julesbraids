"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  productType: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  basePrice: number;
  compareAtPrice?: number;
  images: string[];
  hairOrigin?: string;
  hairTexture?: string;
  variants: Array<{
    id?: string;
    sku: string;
    length?: string;
    price: number;
    stock: number;
  }>;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickStatusToggle = async (product: ProductItem) => {
    const nextStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variants?.some((v) => v.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
    const matchesType = typeFilter === "ALL" || product.productType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate metrics
  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const lowStockCount = products.filter((p) =>
    p.variants?.some((v) => Number(v.stock) > 0 && Number(v.stock) <= 5)
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Manage your luxury hair inventory, upload new items, and configure variants.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh product list"
            aria-label="Refresh product catalog"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-taupe" : "text-charcoal"}`}
            />
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md bg-obsidian px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98]"
          >
            <Plus className="mr-1.5 h-4 w-4 text-champagne" />
            <span>Upload Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Total Products
            </span>
            <Package className="h-4 w-4 text-taupe" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {totalCount}
          </div>
          <div className="text-[11px] text-taupe mt-0.5">Catalog database</div>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Live in Store
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-serif text-emerald-700 font-medium">
            {publishedCount}
          </div>
          <div className="text-[11px] text-taupe mt-0.5">Visible to buyers</div>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Drafts
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-serif text-amber-700 font-medium">
            {draftCount}
          </div>
          <div className="text-[11px] text-taupe mt-0.5">Unpublished</div>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Low Stock
            </span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-serif text-rose-700 font-medium">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-taupe mt-0.5">≤ 5 units left</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-taupe/20 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or slug..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tab Filters */}
          <div className="inline-flex rounded-md border border-taupe/20 bg-taupe/5 p-0.5 text-xs font-medium">
            {["ALL", "PUBLISHED", "DRAFT"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 sm:px-3 py-1.5 rounded transition text-xs ${
                  statusFilter === status
                    ? "bg-white text-obsidian shadow-2xs font-semibold"
                    : "text-charcoal hover:text-obsidian"
                }`}
              >
                {status === "ALL" ? "All" : status === "PUBLISHED" ? "Live" : "Draft"}
              </button>
            ))}
          </div>

          {/* Type dropdown filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-taupe/20 bg-white py-1.5 px-2.5 sm:px-3 text-xs font-medium text-charcoal focus:border-obsidian focus:ring-1 focus:ring-obsidian"
          >
            <option value="ALL">All Categories</option>
            <option value="WIG">Wigs</option>
            <option value="BUNDLE">Bundles</option>
            <option value="CLOSURE">Closures</option>
            <option value="FRONTAL">Frontals</option>
            <option value="ACCESSORY">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Presentation: Responsive Cards on Mobile & Table on Tablet/Desktop */}
      <div className="rounded-xl border border-taupe/20 bg-white shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-taupe">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
            <p className="text-sm font-medium">Loading catalog products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Package className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
            <h3 className="text-base font-serif font-medium text-obsidian">No products found</h3>
            <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
              {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "No products matched your search or active filters."
                : "Your store does not have any products yet. Get started by uploading your first product."}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5 text-champagne" />
              Upload Product Now
            </Link>
          </div>
        ) : (
          <>
            {/* ====== MOBILE CARDS VIEW (< md) ====== */}
            <div className="md:hidden divide-y divide-taupe/10">
              {filteredProducts.map((product) => {
                const totalStock =
                  product.variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) ?? 0;
                const coverImage = product.images?.[0];

                return (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-14 shrink-0 rounded-md overflow-hidden bg-taupe/10 border border-taupe/15 relative">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[9px] text-taupe uppercase">
                            No Pic
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="inline-flex items-center rounded bg-taupe/10 px-2 py-0.5 text-[10px] font-medium text-charcoal">
                            {product.productType}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusToggle(product)}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${
                              product.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-500/20"
                                : "bg-amber-50 text-amber-800 border border-amber-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.status === "PUBLISHED" ? "bg-emerald-600" : "bg-amber-600"
                              }`}
                            />
                            {product.status}
                          </button>
                        </div>

                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium text-sm text-obsidian hover:text-champagne transition block mt-1 line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm text-obsidian">
                            {formatCurrency(product.basePrice)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-taupe line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                          <span className="text-[11px] text-taupe">•</span>
                          <span
                            className={`text-xs font-medium ${
                              totalStock === 0
                                ? "text-rose-600"
                                : totalStock <= 5
                                ? "text-amber-600"
                                : "text-taupe"
                            }`}
                          >
                            {totalStock === 0 ? "Out of stock" : `${totalStock} units`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-taupe/10">
                      <span className="text-[11px] text-taupe">
                        {product.variants?.length || 0} Length{" "}
                        {product.variants?.length === 1 ? "Option" : "Options"}
                      </span>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          title="View on store"
                          className="p-1.5 rounded-md text-taupe hover:text-obsidian hover:bg-taupe/10 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          title="Edit product"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-taupe/10 text-charcoal hover:bg-taupe/20 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(product.id)}
                          title="Delete product"
                          className="p-1.5 rounded-md text-taupe hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ====== DESKTOP & TABLET TABLE VIEW (>= md) ====== */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-taupe/15 bg-taupe/5 text-[11px] font-semibold uppercase tracking-wider text-taupe">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Product</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Starting Price</th>
                    <th className="py-3.5 px-3">Inventory</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {filteredProducts.map((product) => {
                    const totalStock =
                      product.variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) ?? 0;
                    const coverImage = product.images?.[0];

                    return (
                      <tr key={product.id} className="hover:bg-warm-white/40 transition">
                        {/* Product Thumbnail & Title */}
                        <td className="py-4 pl-6 pr-3">
                          <div className="flex items-center gap-3.5">
                            <div className="h-14 w-12 shrink-0 rounded-md overflow-hidden bg-taupe/10 border border-taupe/15 relative">
                              {coverImage ? (
                                <img
                                  src={coverImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-taupe uppercase">
                                  No Pic
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="font-medium text-obsidian hover:text-champagne transition line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-taupe mt-0.5">
                                <span className="font-mono text-[11px]">/{product.slug}</span>
                                {product.hairTexture && (
                                  <>
                                    <span>•</span>
                                    <span>{product.hairTexture}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-3">
                          <span className="inline-flex items-center rounded bg-taupe/10 px-2 py-0.5 text-[11px] font-medium text-charcoal">
                            {product.productType}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-3">
                          <div className="font-medium text-obsidian">
                            {formatCurrency(product.basePrice)}
                          </div>
                          {product.compareAtPrice && (
                            <div className="text-xs text-taupe line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </div>
                          )}
                        </td>

                        {/* Stock & Variants */}
                        <td className="py-4 px-3">
                          <div className="text-xs">
                            <span
                              className={`font-medium ${
                                totalStock === 0
                                  ? "text-rose-600"
                                  : totalStock <= 5
                                  ? "text-amber-600"
                                  : "text-obsidian"
                              }`}
                            >
                              {totalStock === 0 ? "Out of Stock" : `${totalStock} units`}
                            </span>
                            <span className="text-taupe block text-[11px]">
                              {product.variants?.length || 0}{" "}
                              {product.variants?.length === 1 ? "variant" : "variants"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">
                          <button
                            type="button"
                            onClick={() => handleQuickStatusToggle(product)}
                            title="Click to toggle status between Live and Draft"
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase transition hover:opacity-80 ${
                              product.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-500/20"
                                : product.status === "DRAFT"
                                ? "bg-amber-50 text-amber-800 border border-amber-500/20"
                                : "bg-gray-100 text-gray-700 border border-gray-300"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.status === "PUBLISHED"
                                  ? "bg-emerald-600"
                                  : product.status === "DRAFT"
                                  ? "bg-amber-600"
                                  : "bg-gray-500"
                              }`}
                            />
                            {product.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              title="View in Storefront"
                              className="p-1.5 rounded text-taupe hover:text-obsidian hover:bg-taupe/10 transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              title="Edit Product"
                              className="p-1.5 rounded text-taupe hover:text-obsidian hover:bg-taupe/10 transition"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(product.id)}
                              title="Delete Product"
                              className="p-1.5 rounded text-taupe hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-serif font-medium text-obsidian">Delete Product</h3>
            <p className="text-xs sm:text-sm text-taupe">
              Are you sure you want to permanently delete this product? This action cannot be undone and will remove it from the online store.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-md border border-taupe/20 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-warm-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
