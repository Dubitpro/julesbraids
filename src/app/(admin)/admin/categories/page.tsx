"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tags,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Package,
  Layers,
  RefreshCw,
  X,
  Check,
  CheckCircle2,
} from "lucide-react";
import { CategoryItem } from "@/src/lib/admin-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    productType: "WIG" as CategoryItem["productType"],
    imageUrl: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      productType: "WIG",
      imageUrl: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      productType: cat.productType,
      imageUrl: cat.imageUrl || "",
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) => [...prev, data.category]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save category error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Hair Categories
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Organize wigs, bundles, frontals, closures, and accessories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCategories}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh categories"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-taupe" : "text-charcoal"}`}
            />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md bg-obsidian px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98]"
          >
            <Plus className="mr-1.5 h-4 w-4 text-champagne" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="rounded-xl border border-taupe/20 bg-white p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>
        <span className="text-xs text-taupe shrink-0 hidden sm:inline-block">
          {filteredCategories.length} categories
        </span>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center text-taupe">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
          <p className="text-sm font-medium">Loading hair categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-taupe/20 bg-white p-6 shadow-2xs">
          <Tags className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
          <h3 className="text-base font-serif font-medium text-obsidian">No categories found</h3>
          <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
            Create categories to classify your lace wigs, temple bundles, and hair essentials.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5 text-champagne" /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-taupe/20 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                {/* Header Image or Gradient Banner */}
                <div className="h-32 sm:h-36 relative bg-charcoal overflow-hidden group">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-obsidian to-charcoal flex items-center justify-center">
                      <Tags className="h-10 w-10 text-champagne/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-champagne block">
                        {cat.productType}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-medium text-white truncate">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-xs">
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Description & Product Count */}
                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-2">
                    {cat.description || "Luxury curated hair products and accessories."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-taupe pt-1">
                    <span className="font-mono text-[11px]">/{cat.slug}</span>
                    <span className="font-semibold text-obsidian bg-taupe/10 px-2 py-0.5 rounded">
                      {(cat as any).productCount ?? 0} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-taupe/15 px-4 py-3 bg-warm-white/40 flex items-center justify-between">
                <Link
                  href={`/admin/products?type=${cat.productType}`}
                  className="text-xs font-semibold uppercase tracking-wider text-obsidian hover:text-champagne flex items-center gap-1 transition"
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>View Items</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-taupe hover:text-obsidian hover:bg-taupe/10 rounded transition"
                    title="Edit category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-taupe hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
              <h3 className="text-lg font-serif font-medium text-obsidian">
                {editingCategory ? "Edit Hair Category" : "Add New Hair Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-taupe hover:text-obsidian rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: !editingCategory
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        : prev.slug,
                    }));
                  }}
                  placeholder="e.g. HD Swiss Lace Wigs"
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Product Classification
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productType: e.target.value as CategoryItem["productType"],
                      }))
                    }
                    className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  >
                    <option value="WIG">Wigs</option>
                    <option value="BUNDLE">Bundles</option>
                    <option value="CLOSURE">Closures</option>
                    <option value="FRONTAL">Frontals</option>
                    <option value="ACCESSORY">Accessories</option>
                    <option value="RAW">Raw Hair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="hd-swiss-lace-wigs"
                    className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe this category of hair..."
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <label htmlFor="isActive" className="text-xs text-charcoal font-medium">
                  Active (Displayed in customer navigation)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-taupe/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-taupe/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-warm-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
