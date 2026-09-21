"use client";

import { useCartStore } from "@/src/lib/store/cart";
import { formatCurrency } from "@/src/lib/utils";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  
  // Prevent hydration mismatch for persisted store
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-warm-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-taupe/10">
            <h2 className="font-serif text-xl text-obsidian tracking-tight">Your Bag</h2>
            <button 
              onClick={closeCart}
              className="text-taupe hover:text-obsidian transition-colors p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 rounded-full bg-taupe/5">
                  <ShoppingBag className="h-8 w-8 text-taupe/40" />
                </div>
                <div>
                  <p className="text-obsidian font-medium">Your bag is empty.</p>
                  <p className="text-sm text-taupe mt-1">Discover our exclusive collections.</p>
                </div>
                <button 
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 bg-obsidian text-white text-sm font-medium tracking-widest uppercase hover:bg-champagne transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image Placeholder */}
                  <div className="w-24 h-32 bg-taupe/10 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-taupe/40">
                      Image
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-obsidian line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-taupe mt-1">{item.length}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-taupe hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-end justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-taupe/30 h-8 w-24">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex-1 h-full flex items-center justify-center text-taupe hover:text-obsidian"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs text-obsidian font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex-1 h-full flex items-center justify-center text-taupe hover:text-obsidian"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-obsidian">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="border-t border-taupe/10 p-6 bg-white space-y-4">
              <div className="flex justify-between items-center text-obsidian">
                <span className="text-sm">Subtotal</span>
                <span className="font-medium">{formatCurrency(getCartTotal())}</span>
              </div>
              <p className="text-xs text-taupe text-center">Shipping and taxes calculated at checkout.</p>
              
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center py-4 bg-obsidian text-white text-sm font-medium tracking-widest uppercase hover:bg-champagne transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
