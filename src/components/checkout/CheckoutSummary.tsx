"use client";

import { useCartStore } from "@/src/lib/store/cart";
import { formatCurrency } from "@/src/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CheckoutSummary() {
  const { items, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-taupe/20">
        <ShoppingBag className="h-12 w-12 text-taupe/30 mb-4" />
        <h3 className="text-lg font-medium text-obsidian">Your bag is empty</h3>
        <p className="text-sm text-taupe mt-2 mb-6">Return to the shop to add items.</p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-obsidian text-white text-sm font-medium tracking-widest uppercase hover:bg-champagne transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping placeholder
  const total = subtotal + shipping;

  return (
    <div className="bg-warm-white/50 p-6 lg:p-8 rounded-sm border border-taupe/20 sticky top-32">
      <h2 className="text-lg font-serif text-obsidian tracking-tight mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-20 bg-taupe/10 relative shrink-0">
               <div className="absolute -top-2 -right-2 bg-obsidian text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center z-10">
                 {item.quantity}
               </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-sm font-medium text-obsidian line-clamp-1">{item.name}</h3>
              <p className="text-xs text-taupe mt-0.5">{item.length}</p>
            </div>
            <div className="flex items-center text-sm font-medium text-obsidian">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-taupe/20 pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-taupe">
          <span>Subtotal</span>
          <span className="text-obsidian">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-taupe">
          <span>Shipping</span>
          <span className="text-obsidian">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
      </div>

      <div className="border-t border-taupe/20 mt-4 pt-4 flex justify-between items-end">
        <span className="text-base font-medium text-obsidian">Total</span>
        <span className="text-2xl font-medium text-obsidian">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
