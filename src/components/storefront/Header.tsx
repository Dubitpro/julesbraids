"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/src/lib/store/cart";
import { useAuth } from "@/src/lib/context/AuthContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getCartCount } = useCartStore();
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white text-black border-b border-gray-200 py-3"
            : "bg-transparent text-white py-6"
        }`}
      >
        <div className="w-full px-6 flex items-center justify-between">
          
          {/* Left Navigation (Desktop) / Menu (Mobile) */}
          <div className="flex items-center gap-6 flex-1">
            <button 
              className="lg:hidden hover:text-champagne transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/shop" className="text-[11px] font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors">
                Shop All
              </Link>
              <Link href="/shop?category=WIG" className="text-[11px] font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors">
                Wigs
              </Link>
              <Link href="/shop?category=BUNDLE" className="text-[11px] font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors">
                Bundles
              </Link>
              <Link href="/admin" className="text-[11px] font-medium tracking-[0.2em] uppercase text-champagne hover:underline transition-colors">
                Admin
              </Link>
            </nav>
          </div>

          {/* Brand Name & Logo (Desktop: Logo + Name; Mobile: Just the Name "Julesbraids & Hairs") */}
          <div className="flex-1 text-center flex justify-center">
            <Link href="/" className="hover:opacity-85 transition-all flex items-center justify-center gap-2.5 sm:gap-3 group">
              <img 
                src="/logo.jpg" 
                alt="JulesBraids & Hairs" 
                className="hidden md:block h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full ring-1 ring-champagne/40 shadow-sm shrink-0 transition-transform group-hover:scale-105" 
              />
              <span className="font-serif text-base sm:text-lg md:text-xl font-medium tracking-[0.08em] sm:tracking-[0.12em] uppercase whitespace-nowrap">
                Julesbraids &amp; Hairs
              </span>
            </Link>
          </div>

          {/* Account & Cart (Right) */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <button className="hidden lg:flex hover:text-champagne transition-colors">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              className="hidden lg:flex items-center gap-1.5 hover:text-champagne transition-colors relative"
              title={user ? `Account (${user.displayName || user.email})` : "Sign In"}
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              {user && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
              )}
            </Link>
            <button 
              onClick={openCart}
              className="flex items-center gap-2 hover:text-champagne transition-colors"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">{mounted ? getCartCount() : 0}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <button 
              className="hover:text-champagne transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <Link 
              href="/" 
              className="hover:opacity-80 transition-opacity flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-serif text-base font-medium tracking-[0.12em] uppercase">
                Julesbraids &amp; Hairs
              </span>
            </Link>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>

          <div className="flex-1 overflow-y-auto py-12 px-8 flex flex-col gap-8">
            <nav className="flex flex-col gap-8 text-center">
              <Link 
                href="/shop" 
                className="text-sm font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link 
                href="/shop/wigs" 
                className="text-sm font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wigs
              </Link>
              <Link 
                href="/shop/bundles" 
                className="text-sm font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bundles
              </Link>
              <Link 
                href="/shop/closures" 
                className="text-sm font-medium tracking-[0.2em] uppercase hover:text-champagne transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Closures
              </Link>
            </nav>

            <div className="mt-auto pt-12 border-t border-gray-200 flex flex-col gap-6 text-center">
              <Link 
                href={user ? "/account" : "/login"} 
                className="text-xs font-medium tracking-[0.2em] uppercase text-gray-500 hover:text-champagne transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                {user ? "My Account" : "Sign In / Register"}
              </Link>
              <button 
                className="text-xs font-medium tracking-[0.2em] uppercase text-gray-500 hover:text-champagne transition-colors flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
