import { notFound } from "next/navigation";
import { getProductBySlug } from "@/src/lib/products-store";
import { ProductGallery } from "@/src/components/product/ProductGallery";
import { ProductOptions } from "@/src/components/product/ProductOptions";
import { Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-warm-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-taupe mb-8">
          <Link href="/" className="hover:text-obsidian transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-obsidian transition">
            Shop
          </Link>
          <span>/</span>
          <span className="text-obsidian font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Right Column: Product Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Origin & Texture Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.hairOrigin && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-taupe/10 text-charcoal px-2.5 py-1 rounded-xs">
                  {product.hairOrigin}
                </span>
              )}
              {product.hairTexture && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-champagne/15 text-champagne-dark px-2.5 py-1 rounded-xs font-medium">
                  {product.hairTexture}
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-serif text-obsidian tracking-tight mb-2">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-taupe leading-relaxed mt-1">
                {product.shortDescription}
              </p>
            )}

            {/* Interactive Variant Selection & Pricing */}
            <ProductOptions
              productId={product.id}
              productName={product.name}
              variants={product.variants || []}
              basePrice={product.basePrice}
            />

            {/* Product Full Description */}
            <div className="border-t border-taupe/20 pt-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-obsidian">
                Hair Specifications & Notes
              </h3>
              <div className="prose prose-sm text-charcoal/80 text-sm leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-taupe/20 text-xs text-charcoal">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-champagne shrink-0" />
                <span>100% Unprocessed Virgin Hair</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-champagne shrink-0" />
                <span>Express Worldwide Shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-champagne shrink-0" />
                <span>Pre-Plucked Natural Hairline</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-champagne shrink-0" />
                <span>Bleach, Dye & Heat Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
