"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Search,
  RefreshCw,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Package,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface InventoryItem {
  productId: string;
  productName: string;
  productSlug: string;
  productType: string;
  productImage?: string;
  variantId?: string;
  variantIndex: number;
  sku: string;
  length?: string;
  price: number;
  stock: number;
  status: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "LOW" | "OUT" | "IN">("ALL");
  const [updatingSku, setUpdatingSku] = useState<string | null>(null);
  const [successSku, setSuccessSku] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (item: InventoryItem, newStock: number) => {
    if (newStock < 0) return;
    const targetSku = item.sku;
    setUpdatingSku(targetSku);

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) =>
        i.productId === item.productId && i.variantIndex === item.variantIndex
          ? { ...i, stock: newStock }
          : i
      )
    );

    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          variantIndex: item.variantIndex,
          stock: newStock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessSku(targetSku);
        setTimeout(() => setSuccessSku(null), 1800);
      }
    } catch (err) {
      console.error("Stock update error:", err);
    } finally {
      setUpdatingSku(null);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.length && item.length.toLowerCase().includes(searchTerm.toLowerCase()));

    const stock = Number(item.stock) || 0;
    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "OUT" && stock === 0) ||
      (stockFilter === "LOW" && stock > 0 && stock <= 5) ||
      (stockFilter === "IN" && stock > 5);

    return matchesSearch && matchesStock;
  });

  const totalVariants = items.length;
  const outOfStockCount = items.filter((i) => (Number(i.stock) || 0) === 0).length;
  const lowStockCount = items.filter(
    (i) => (Number(i.stock) || 0) > 0 && (Number(i.stock) || 0) <= 5
  ).length;
  const totalUnits = items.reduce((acc, i) => acc + (Number(i.stock) || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Inventory &amp; Stock Levels
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Real-time stock controls across all hair lengths, textures, and bundles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchInventory}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh stock levels"
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
            <span>New Variant</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Total Hair Units
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {totalUnits}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Physical items available</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Active Variants
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {totalVariants}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Unique length SKUs</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Low Stock Alert
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-amber-700 font-medium">
            {lowStockCount}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Variants ≤ 5 left</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Out of Stock
            </span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-rose-700 font-medium">
            {outOfStockCount}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Needs immediate restock</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-xl border border-taupe/20 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hair name, SKU, or length..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: "ALL", label: "All Items" },
              { key: "LOW", label: "Low Stock (≤5)" },
              { key: "OUT", label: "Out of Stock" },
              { key: "IN", label: "In Stock" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStockFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                stockFilter === tab.key
                  ? "bg-obsidian text-white shadow-2xs font-semibold"
                  : "bg-taupe/10 text-charcoal hover:bg-taupe/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Presentation */}
      <div className="rounded-xl border border-taupe/20 bg-white shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-taupe">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
            <p className="text-sm font-medium">Loading inventory records...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Archive className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
            <h3 className="text-base font-serif font-medium text-obsidian">No variants found</h3>
            <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
              {searchTerm || stockFilter !== "ALL"
                ? "No variants match your current filter settings."
                : "No variants found in catalog database."}
            </p>
          </div>
        ) : (
          <>
            {/* ====== MOBILE CARD VIEW (< md) ====== */}
            <div className="md:hidden divide-y divide-taupe/10">
              {filteredItems.map((item) => {
                const stockNum = Number(item.stock) || 0;
                const isItemUpdating = updatingSku === item.sku;
                const isItemSuccess = successSku === item.sku;

                return (
                  <div key={`${item.productId}-${item.sku}`} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-12 shrink-0 rounded-md overflow-hidden bg-taupe/10 border border-taupe/15">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[9px] text-taupe">
                            No Pic
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-taupe block">
                          {item.productType}
                        </span>
                        <h4 className="font-medium text-sm text-obsidian truncate">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-taupe mt-0.5">
                          <span className="font-semibold text-obsidian">{item.length}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{item.sku}</span>
                          <span>•</span>
                          <span className="font-semibold text-charcoal">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock level updater controls for mobile touch */}
                    <div className="flex items-center justify-between pt-2 border-t border-taupe/10">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            stockNum === 0
                              ? "bg-rose-50 text-rose-800"
                              : stockNum <= 5
                              ? "bg-amber-50 text-amber-800"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {stockNum === 0 ? "Out of Stock" : stockNum <= 5 ? "Low Stock" : "In Stock"}
                        </span>
                        {isItemSuccess && (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium animate-fadeIn">
                            <Check className="h-3 w-3" /> Saved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockUpdate(item, stockNum - 1)}
                          disabled={stockNum <= 0 || isItemUpdating}
                          className="h-8 w-8 rounded-md border border-taupe/30 bg-white flex items-center justify-center text-charcoal hover:bg-taupe/10 active:scale-95 disabled:opacity-30 transition"
                          title="Decrease stock"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          value={stockNum}
                          onChange={(e) =>
                            handleStockUpdate(item, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-14 text-center rounded-md border border-taupe/30 py-1 text-xs font-semibold text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockUpdate(item, stockNum + 1)}
                          disabled={isItemUpdating}
                          className="h-8 w-8 rounded-md border border-taupe/30 bg-white flex items-center justify-center text-charcoal hover:bg-taupe/10 active:scale-95 transition"
                          title="Increase stock"
                        >
                          <Plus className="h-3.5 w-3.5" />
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
                    <th className="py-3.5 pl-6 pr-3">Product &amp; Thumbnail</th>
                    <th className="py-3.5 px-3">Length / Option</th>
                    <th className="py-3.5 px-3">SKU</th>
                    <th className="py-3.5 px-3">Price</th>
                    <th className="py-3.5 px-3">Current Stock</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {filteredItems.map((item) => {
                    const stockNum = Number(item.stock) || 0;
                    const isItemUpdating = updatingSku === item.sku;
                    const isItemSuccess = successSku === item.sku;

                    return (
                      <tr key={`${item.productId}-${item.sku}`} className="hover:bg-warm-white/40 transition">
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-10 shrink-0 rounded bg-taupe/10 border border-taupe/15 overflow-hidden">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[9px] text-taupe">
                                  No Pic
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-obsidian block truncate max-w-xs">
                                {item.productName}
                              </span>
                              <span className="text-[11px] text-taupe font-mono">
                                /{item.productSlug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-obsidian">
                          {item.length || "Standard"}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-xs text-taupe">
                          {item.sku}
                        </td>

                        <td className="py-3.5 px-3 font-medium text-obsidian">
                          {formatCurrency(item.price)}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`font-semibold text-sm ${
                              stockNum === 0
                                ? "text-rose-600"
                                : stockNum <= 5
                                ? "text-amber-600"
                                : "text-obsidian"
                            }`}
                          >
                            {stockNum} units
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              stockNum === 0
                                ? "bg-rose-50 text-rose-800"
                                : stockNum <= 5
                                ? "bg-amber-50 text-amber-800"
                                : "bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            {stockNum === 0 ? "Out of Stock" : stockNum <= 5 ? "Low Stock" : "In Stock"}
                          </span>
                        </td>

                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isItemSuccess && (
                              <span className="text-xs text-emerald-600 flex items-center gap-1 mr-1 animate-fadeIn">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(item, stockNum - 1)}
                              disabled={stockNum <= 0 || isItemUpdating}
                              className="h-7 w-7 rounded border border-taupe/30 bg-white flex items-center justify-center text-charcoal hover:bg-taupe/10 active:scale-95 disabled:opacity-30 transition"
                              title="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              value={stockNum}
                              onChange={(e) =>
                                handleStockUpdate(item, parseInt(e.target.value, 10) || 0)
                              }
                              className="w-14 text-center rounded border border-taupe/30 py-0.5 text-xs font-semibold text-obsidian focus:border-obsidian focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(item, stockNum + 1)}
                              disabled={isItemUpdating}
                              className="h-7 w-7 rounded border border-taupe/30 bg-white flex items-center justify-center text-charcoal hover:bg-taupe/10 active:scale-95 transition"
                              title="Increase"
                            >
                              <Plus className="h-3 w-3" />
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
    </div>
  );
}
