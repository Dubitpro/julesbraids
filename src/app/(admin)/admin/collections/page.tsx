"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  RefreshCw,
  X,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { CollectionItem } from "@/src/lib/admin-data";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    status: "ACTIVE" as CollectionItem["status"],
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      if (data.success && data.collections) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error("Failed to load collections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1200&auto=format&fit=crop",
      isFeatured: false,
      status: "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (col: CollectionItem) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description,
      imageUrl: col.imageUrl,
      isFeatured: col.isFeatured,
      status: col.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      if (editingCollection) {
        const res = await fetch(`/api/collections/${editingCollection.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setCollections((prev) =>
            prev.map((c) => (c.id === editingCollection.id ? { ...c, ...formData } : c))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setCollections((prev) => [...prev, data.collection]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save collection error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Delete collection error:", err);
    }
  };

  const filteredCollections = collections.filter(
    (c) =>
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
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Build featured edits, seasonal lookbooks, and luxury hair series.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCollections}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh collections"
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
            <span>New Collection</span>
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
            placeholder="Search collections by title, description or slug..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>
        <span className="text-xs text-taupe shrink-0 hidden sm:inline-block">
          {filteredCollections.length} collections
        </span>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="py-20 text-center text-taupe">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
          <p className="text-sm font-medium">Loading collections...</p>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-taupe/20 bg-white p-6 shadow-2xs">
          <Layers className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
          <h3 className="text-base font-serif font-medium text-obsidian">No collections found</h3>
          <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
            Group your raw hair, lace melt series, and seasonal specials into editorial collections.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5 text-champagne" /> Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="rounded-xl border border-taupe/20 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                {/* Hero Photo Banner */}
                <div className="h-40 sm:h-44 relative bg-charcoal overflow-hidden group">
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {col.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-champagne text-obsidian shadow-xs">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-serif font-medium text-white">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-gray-300 font-mono">/{col.slug}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                        col.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {col.status}
                    </span>
                    <span className="text-[11px] text-taupe font-medium">
                      Curated Series
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-taupe/15 px-4 py-3 bg-warm-white/40 flex items-center justify-between">
                <Link
                  href="/shop"
                  target="_blank"
                  className="text-xs font-semibold uppercase tracking-wider text-obsidian hover:text-champagne flex items-center gap-1 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View on Store</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-taupe hover:text-obsidian hover:bg-taupe/10 rounded transition"
                    title="Edit collection"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(col.id)}
                    className="p-1.5 text-taupe hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
              <h3 className="text-lg font-serif font-medium text-obsidian">
                {editingCollection ? "Edit Hair Collection" : "Create New Hair Collection"}
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
                  Collection Title <span className="text-red-500">*</span>
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
                      slug: !editingCollection
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        : prev.slug,
                    }));
                  }}
                  placeholder="e.g. Raw Vietnamese Luxury Edition"
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="raw-vietnamese-luxury"
                    className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as CollectionItem["status"],
                      }))
                    }
                    className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  >
                    <option value="ACTIVE">Active (Live)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  required
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
                  placeholder="Describe this curated collection..."
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <label htmlFor="isFeatured" className="text-xs text-charcoal font-medium">
                  Feature prominently on store homepage carousel
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
                  {isSaving ? "Saving..." : editingCollection ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
