import Link from "next/link";
import { formatCurrency } from "@/src/lib/utils";

interface ProductCardProps {
  product: {
    id?: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    imageUrl?: string;
    images?: string[];
    isNew?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    productType?: string;
    hairTexture?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images?.[0] || product.imageUrl;
  const isNew = product.isNew || product.isNewArrival;

  return (
    <Link href={`/products/${product.slug}`} className="group block text-center">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory mb-5 rounded-sm border border-taupe/15">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {isNew && (
            <span className="bg-obsidian/90 backdrop-blur text-white text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-champagne text-white text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-xs">
              Best Seller
            </span>
          )}
        </div>

        {/* Product Image */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-taupe/10 flex items-center justify-center">
            <span className="text-taupe/60 text-[11px] tracking-widest uppercase">
              {product.productType || "Luxury Hair"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1.5 px-2">
        {product.hairTexture && (
          <span className="text-[10px] uppercase tracking-widest text-taupe">
            {product.hairTexture}
          </span>
        )}
        <h3 className="text-xs font-medium text-obsidian tracking-[0.12em] uppercase group-hover:text-champagne transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2.5 text-xs tracking-wider pt-0.5">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-taupe line-through text-[11px]">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
          <span className="text-obsidian font-medium">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
