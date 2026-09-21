"use client";

import { useState } from "react";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";
import { useCartStore } from "@/src/lib/store/cart";
import { Check, ShoppingBag } from "lucide-react";

interface Variant {
  id?: string;
  sku?: string;
  length?: string;
  price: number;
  stock: number;
}

interface ProductOptionsProps {
  productId: string;
  productName: string;
  variants: Variant[];
  basePrice: number;
}

export function ProductOptions({
  productId,
  productName,
  variants,
  basePrice,
}: ProductOptionsProps) {
  const [selectedLength, setSelectedLength] = useState<string | null>(
    variants[0]?.length || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const hasVariants = variants && variants.length > 0;
  const selectedVariant = hasVariants
    ? variants.find((v) => v.length === selectedLength) || variants[0]
    : null;

  const currentPrice = selectedVariant ? selectedVariant.price : basePrice;
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: selectedVariant?.id ? `${productId}-${selectedVariant.id}` : productId,
      productId,
      variantId: selectedVariant?.id || "default",
      name: productName,
      length: selectedVariant?.length || "Standard",
      price: currentPrice,
      quantity: quantity,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="space-y-7 my-6">
      {/* Dynamic Price Display */}
      <div className="text-3xl font-serif text-obsidian tracking-tight">
        {formatCurrency(currentPrice)}
      </div>

      {/* Length Selector */}
      {hasVariants && variants.some((v) => v.length) && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs tracking-widest uppercase">
            <span className="font-semibold text-obsidian">Length Option</span>
            <span className="text-taupe">{selectedLength || variants[0]?.length}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((variant, idx) => {
              const label = variant.length || `Option ${idx + 1}`;
              const isSelected = (selectedLength || variants[0]?.length) === variant.length;
              const outOfStock = variant.stock <= 0;

              return (
                <button
                  key={variant.id || `${variant.sku}-${idx}`}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedLength(variant.length || null)}
                  className={cn(
                    "px-4 py-2.5 text-xs tracking-wider uppercase transition-all duration-200 border rounded-xs relative",
                    isSelected
                      ? "border-obsidian bg-obsidian text-white font-medium"
                      : "border-taupe/30 text-charcoal hover:border-obsidian bg-white",
                    outOfStock && "opacity-40 cursor-not-allowed line-through"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Cart Actions */}
      <div className="space-y-3.5 pt-4 border-t border-taupe/20">
        <div className="flex gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-taupe/30 rounded-xs w-28 h-12 bg-white">
            <button
              type="button"
              className="flex-1 h-full flex items-center justify-center text-taupe hover:text-obsidian transition-colors text-base"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="text-sm text-obsidian font-semibold">{quantity}</span>
            <button
              type="button"
              className="flex-1 h-full flex items-center justify-center text-taupe hover:text-obsidian transition-colors text-base"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={cn(
              "flex-1 h-12 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 rounded-xs shadow-xs",
              addedAnimation
                ? "bg-emerald-700 text-white"
                : isOutOfStock
                ? "bg-taupe/20 text-taupe cursor-not-allowed"
                : "bg-obsidian text-white hover:bg-champagne hover:text-white"
            )}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4" /> Added to Bag
              </>
            ) : isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
