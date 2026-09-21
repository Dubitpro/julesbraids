"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/src/lib/validation/product";
import {
  Save,
  X,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  Check,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Eye,
  Layers,
  DollarSign,
  Tag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: ProductFormValues & { id?: string };
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedProduct, setSavedProduct] = useState<{ id: string; slug: string; name: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      productType: "WIG",
      status: "PUBLISHED",
      basePrice: 199,
      compareAtPrice: undefined,
      currency: "USD",
      hairOrigin: "Vietnamese Raw",
      hairTexture: "Natural Straight",
      images: [],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      variants: [
        { sku: "VAR-18", length: "18 inch", price: 199, stock: 10, isActive: true },
        { sku: "VAR-22", length: "22 inch", price: 239, stock: 8, isActive: true },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedName = watch("name");
  const watchedBasePrice = watch("basePrice");
  const watchedCompareAtPrice = watch("compareAtPrice");

  // Keep images in react-hook-form in sync
  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  // Auto-generate slug if not editing existing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!isEditing && (!watch("slug") || watch("slug") === slugify(watchedName || ""))) {
      setValue("slug", slugify(name));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Quick variant generator for hair lengths
  const handleGenerateStandardVariants = () => {
    const base = Number(watchedBasePrice) || 200;
    const standardLengths = [
      { length: "16 inch", priceIncrement: 0, stock: 12 },
      { length: "18 inch", priceIncrement: 30, stock: 10 },
      { length: "20 inch", priceIncrement: 60, stock: 8 },
      { length: "22 inch", priceIncrement: 95, stock: 8 },
      { length: "24 inch", priceIncrement: 130, stock: 6 },
      { length: "26 inch", priceIncrement: 170, stock: 4 },
      { length: "28 inch", priceIncrement: 210, stock: 3 },
    ];

    const generated = standardLengths.map((item, idx) => {
      const code = (watch("slug") || "HAIR").slice(0, 4).toUpperCase();
      return {
        id: `var-gen-${idx}-${Date.now()}`,
        sku: `${code}-${item.length.replace(/\s+/g, "")}`,
        length: item.length,
        price: Math.round(base + item.priceIncrement),
        compareAtPrice: watchedCompareAtPrice ? Math.round(Number(watchedCompareAtPrice) + item.priceIncrement) : undefined,
        stock: item.stock,
        isActive: true,
      };
    });

    replace(generated);
  };

  // Upload handler for files
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      fileList.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image upload failed");
      }

      const newUrls = data.urls || (data.url ? [data.url] : []);
      setImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
      setUploadError(null);
    } catch {
      setUploadError("Please enter a valid URL (e.g. https://images.unsplash.com/...)");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        images,
        slug: slugify(data.slug || data.name),
      };

      const url = isEditing && initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save product");
      }

      setSavedProduct({
        id: result.product.id,
        slug: result.product.slug,
        name: result.product.name,
      });

      if (!isEditing) {
        // Reset form for further additions if desired, or redirect
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong while saving the product.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Success Notification Banner */}
      {savedProduct && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/80 p-6 backdrop-blur shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-emerald-950">
                  {isEditing ? "Product Updated Successfully!" : "Product Uploaded & Live!"}
                </h3>
                <p className="text-sm text-emerald-800">
                  <span className="font-medium">{savedProduct.name}</span> is saved and available in your store.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${savedProduct.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-emerald-800 transition"
              >
                <Eye className="h-4 w-4" />
                View in Store
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/30 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 hover:bg-emerald-100/50 transition"
              >
                All Products
              </Link>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setSavedProduct(null);
                    setImages([]);
                    reset();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal border border-taupe/20 hover:bg-warm-white transition"
                >
                  <Plus className="h-4 w-4" />
                  Upload Another
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {submitError && (
        <div className="rounded-xl border border-red-500/20 bg-red-50 p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-taupe mb-1">
            <Link href="/admin/products" className="hover:text-obsidian flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Products
            </Link>
            <span>/</span>
            <span>{isEditing ? "Edit Product" : "New Upload"}</span>
          </div>
          <h1 className="text-3xl font-serif text-obsidian tracking-tight">
            {isEditing ? "Edit Product" : "Upload Luxury Hair Product"}
          </h1>
          <p className="text-sm text-taupe mt-1">
            Fill in the hair specifications, upload gallery images, and set up your length variants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm hover:bg-warm-white focus:outline-none transition"
          >
            <X className="mr-2 h-4 w-4 text-taupe" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="inline-flex items-center justify-center rounded-md bg-obsidian px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-charcoal focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 disabled:opacity-50 transition"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving Product..." : isEditing ? "Save Changes" : "Publish Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-5">
            <div className="border-b border-taupe/10 pb-4">
              <h2 className="text-lg font-serif font-medium text-obsidian">Product Details</h2>
              <p className="text-xs text-taupe mt-0.5">Title, slug URL, and luxury descriptions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  onChange={handleNameChange}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2.5 text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:ring-1 focus:ring-obsidian sm:text-sm transition"
                  placeholder="e.g. Raw Vietnamese Natural Straight Lace Front Wig"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-md border border-taupe/30 focus-within:border-obsidian focus-within:ring-1 focus-within:ring-obsidian overflow-hidden">
                  <span className="inline-flex items-center px-3 bg-taupe/5 text-taupe text-xs border-r border-taupe/20">
                    /products/
                  </span>
                  <input
                    type="text"
                    {...register("slug")}
                    className="block w-full border-0 py-2 px-3 text-obsidian placeholder:text-taupe/60 sm:text-sm bg-transparent focus:ring-0"
                    placeholder="raw-vietnamese-straight-wig"
                  />
                </div>
                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Short Tagline / Summary
                </label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:ring-1 focus:ring-obsidian sm:text-sm transition"
                  placeholder="e.g. Ultra-silky raw Vietnamese single-donor lace front wig with invisible HD Swiss lace."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Full Hair Description & Care Guide <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("fullDescription")}
                  rows={5}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:ring-1 focus:ring-obsidian sm:text-sm leading-relaxed transition"
                  placeholder="Describe the hair grade, cuticle alignment, lace melt performance, coloring capability, and recommended maintenance routine..."
                />
                {errors.fullDescription && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullDescription.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media & Image Upload */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-taupe/10 pb-4">
              <div>
                <h2 className="text-lg font-serif font-medium text-obsidian">Product Media</h2>
                <p className="text-xs text-taupe mt-0.5">
                  Upload multiple high-res product photos or supply direct image URLs.
                </p>
              </div>
              <span className="text-xs font-medium text-charcoal bg-taupe/10 px-2.5 py-1 rounded-full">
                {images.length} {images.length === 1 ? "Image" : "Images"}
              </span>
            </div>

            {uploadError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Drag and drop upload dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              className="cursor-pointer group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-taupe/30 p-8 text-center hover:border-obsidian hover:bg-warm-white/40 transition duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                }}
              />
              <div className="rounded-full bg-taupe/10 p-3.5 text-obsidian mb-3 group-hover:scale-110 group-hover:bg-champagne/20 transition">
                <UploadCloud className="h-6 w-6 text-charcoal" />
              </div>
              <p className="text-sm font-medium text-obsidian">
                {isUploading ? "Uploading media..." : "Click or drag images to upload"}
              </p>
              <p className="text-xs text-taupe mt-1">Supports PNG, JPG, WEBP up to 10MB each</p>
            </div>

            {/* Direct URL entry option */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  placeholder="Or paste an image URL (e.g. https://...)"
                  className="w-full rounded-md border border-taupe/30 bg-white py-2 pl-3 pr-10 text-xs text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="inline-flex items-center rounded-md border border-taupe/20 bg-white px-3.5 py-2 text-xs font-semibold text-charcoal hover:bg-taupe/10 transition"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add URL
              </button>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-taupe/20 bg-taupe/5 shadow-xs"
                  >
                    <img
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 z-10 rounded bg-obsidian/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                        Cover
                      </span>
                    )}

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700 transition"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimaryImage(idx);
                          }}
                          className="rounded bg-white/90 text-obsidian text-[10px] font-medium py-1 px-2 hover:bg-white transition"
                        >
                          Make Cover
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants & Length Options */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-taupe/10 pb-4">
              <div>
                <h2 className="text-lg font-serif font-medium text-obsidian">Variants & Hair Lengths</h2>
                <p className="text-xs text-taupe mt-0.5">
                  Set prices and stock quantities across different inch lengths or bundles.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateStandardVariants}
                  className="inline-flex items-center rounded-md border border-champagne/40 bg-champagne/10 px-3 py-1.5 text-xs font-medium text-champagne-dark hover:bg-champagne/20 transition"
                  title="Generate 16 inch to 28 inch variants automatically"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-champagne" />
                  Auto-Populate Lengths (16&quot; - 28&quot;)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextLen = `${18 + fields.length * 2} inch`;
                    append({
                      sku: `${(watch("slug") || "HAIR").slice(0, 4).toUpperCase()}-${nextLen.replace(/\s+/g, "")}`,
                      length: nextLen,
                      price: Number(watchedBasePrice) || 200,
                      stock: 10,
                      isActive: true,
                    });
                  }}
                  className="inline-flex items-center rounded-md border border-taupe/20 bg-white px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-warm-white transition"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Variant
                </button>
              </div>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 rounded-lg border border-dashed border-taupe/20 bg-warm-white/30">
                <Layers className="h-8 w-8 text-taupe/40 mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal">No variants created</p>
                <p className="text-xs text-taupe mt-1 mb-3">
                  This product will be sold as a single unit at the base price.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateStandardVariants}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-obsidian hover:text-champagne underline underline-offset-4"
                >
                  Quick generate standard lengths
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-taupe">
                  <span className="col-span-3">Length / Option</span>
                  <span className="col-span-3">SKU</span>
                  <span className="col-span-2">Price ($)</span>
                  <span className="col-span-2">Compare-At ($)</span>
                  <span className="col-span-1">Stock</span>
                  <span className="col-span-1 text-right">Actions</span>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-lg border border-taupe/20 bg-white p-3.5 hover:border-taupe/40 transition"
                  >
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-[10px] uppercase font-semibold text-taupe mb-1">
                        Length / Option
                      </label>
                      <input
                        type="text"
                        {...register(`variants.${index}.length`)}
                        placeholder="e.g. 20 inch"
                        className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-[10px] uppercase font-semibold text-taupe mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        {...register(`variants.${index}.sku`)}
                        placeholder="SKU-20"
                        className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-[10px] uppercase font-semibold text-taupe mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.price`)}
                        className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-[10px] uppercase font-semibold text-taupe mb-1">
                        Compare ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.compareAtPrice`)}
                        placeholder="Optional"
                        className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-taupe focus:border-obsidian focus:ring-0"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block sm:hidden text-[10px] uppercase font-semibold text-taupe mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        {...register(`variants.${index}.stock`)}
                        className="block w-full rounded border border-taupe/30 px-2 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 text-taupe hover:text-red-500 rounded hover:bg-red-50 transition"
                        title="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (1 Column) */}
        <div className="space-y-8">
          {/* Publishing Status */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-medium text-obsidian border-b border-taupe/10 pb-3">
              Storefront Status
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Visibility Status
              </label>
              <select
                {...register("status")}
                className="block w-full rounded-md border border-taupe/30 bg-white py-2 px-3 text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
              >
                <option value="PUBLISHED">Published (Live in Store)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Pricing & Value */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-medium text-obsidian border-b border-taupe/10 pb-3">
              Base Pricing
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                Starting Base Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-taupe text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("basePrice")}
                  className="block w-full rounded-md border border-taupe/30 bg-white py-2 pl-7 pr-3 text-sm text-obsidian font-semibold focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  placeholder="0.00"
                />
              </div>
              {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                Compare-at Price (Original $)
              </label>
              <div className="relative rounded-md shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-taupe text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register("compareAtPrice")}
                  className="block w-full rounded-md border border-taupe/30 bg-white py-2 pl-7 pr-3 text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  placeholder="e.g. 260.00"
                />
              </div>
              {watchedCompareAtPrice && Number(watchedCompareAtPrice) > Number(watchedBasePrice) && (
                <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                  Displays a {Math.round((1 - Number(watchedBasePrice) / Number(watchedCompareAtPrice)) * 100)}% discount badge
                </p>
              )}
            </div>
          </div>

          {/* Hair Specifications & Organization */}
          <div className="rounded-xl border border-taupe/20 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-medium text-obsidian border-b border-taupe/10 pb-3">
              Hair Category & Specs
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Product Category
              </label>
              <select
                {...register("productType")}
                className="block w-full rounded-md border border-taupe/30 bg-white py-2 px-3 text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
              >
                <option value="WIG">Lace Front & Full Wigs</option>
                <option value="BUNDLE">Bundles & Multi-Packs</option>
                <option value="CLOSURE">HD Swiss Lace Closures</option>
                <option value="FRONTAL">Ear-to-Ear HD Frontals</option>
                <option value="ACCESSORY">Care & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Hair Origin
              </label>
              <select
                {...register("hairOrigin")}
                className="block w-full rounded-md border border-taupe/30 bg-white py-2 px-3 text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
              >
                <option value="Vietnamese Raw">Vietnamese Raw (Single Donor)</option>
                <option value="Virgin Indian">Virgin Indian (Temple Hair)</option>
                <option value="Cambodian Virgin">Cambodian Virgin</option>
                <option value="Burmese Raw">Burmese Raw</option>
                <option value="Brazilian Virgin">Brazilian Virgin</option>
                <option value="Peruvian">Peruvian Virgin</option>
                <option value="South East Asian">South East Asian</option>
                <option value="N/A">N/A (Accessories / Care)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Hair Texture
              </label>
              <select
                {...register("hairTexture")}
                className="block w-full rounded-md border border-taupe/30 bg-white py-2 px-3 text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
              >
                <option value="Natural Straight">Natural Straight / Bone Straight</option>
                <option value="Body Wave">Body Wave</option>
                <option value="Deep Wave">Deep Wave</option>
                <option value="Water Wave">Water Wave</option>
                <option value="Burmese Curly">Burmese Curly</option>
                <option value="Kinky Straight">Kinky Straight / Blowout</option>
                <option value="Loose Wave">Loose Wave</option>
                <option value="Coil Curl">Coil Curl</option>
                <option value="Smooth Satin">Smooth Satin / Silk</option>
              </select>
            </div>

            {/* Badges */}
            <div className="pt-2 border-t border-taupe/10 space-y-2.5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                Storefront Badges
              </span>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <span className="text-xs text-charcoal font-medium">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isNewArrival")}
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <span className="text-xs text-charcoal font-medium">New Arrival Tag</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isBestSeller")}
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <span className="text-xs text-charcoal font-medium">Best Seller Badge</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
