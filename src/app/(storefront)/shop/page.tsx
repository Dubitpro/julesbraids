import { ProductCard } from "@/src/components/product/ProductCard";
import { getAllProducts } from "@/src/lib/products-store";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; sort?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const category = resolvedParams.category;
  
  const allProducts = await getAllProducts({
    status: "PUBLISHED",
    type: category && category !== "ALL" ? category : undefined,
  });

  const categories = [
    { label: "All Items", value: "ALL" },
    { label: "Wigs", value: "WIG" },
    { label: "Bundles", value: "BUNDLE" },
    { label: "Closures", value: "CLOSURE" },
    { label: "Frontals", value: "FRONTAL" },
    { label: "Accessories", value: "ACCESSORY" },
  ];

  return (
    <div className="bg-warm-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-champagne mb-2">
            The Complete Collection
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif text-obsidian tracking-tight mb-4">
            Shop Luxury Hair
          </h1>
          <p className="text-taupe max-w-xl text-sm leading-relaxed">
            Ethically sourced single-donor raw bundles, ultra-thin HD lace front wigs, and bespoke hair closures.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = (!category && cat.value === "ALL") || category === cat.value;
            return (
              <Link
                key={cat.value}
                href={cat.value === "ALL" ? "/shop" : `/shop?category=${cat.value}`}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition ${
                  isActive
                    ? "bg-obsidian text-white border-obsidian font-semibold"
                    : "border-taupe/20 text-charcoal hover:border-obsidian bg-white"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Product Count Strip */}
        <div className="flex items-center justify-between border-y border-taupe/20 py-3.5 mb-12 text-xs uppercase tracking-widest text-taupe">
          <span>{allProducts.length} Luxury Pieces</span>
          <div className="flex items-center gap-4">
            <span className="text-obsidian font-medium">Guaranteed Raw & Virgin</span>
          </div>
        </div>

        {/* Product Grid */}
        {allProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base font-serif text-obsidian">No products found in this category.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-xs font-semibold uppercase tracking-wider text-champagne hover:underline"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.basePrice,
                  compareAtPrice: product.compareAtPrice,
                  images: product.images,
                  isNewArrival: product.isNewArrival,
                  isBestSeller: product.isBestSeller,
                  hairTexture: product.hairTexture,
                  productType: product.productType,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
