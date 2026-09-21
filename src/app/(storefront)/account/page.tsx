"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, Heart, Settings, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/src/lib/context/AuthContext";

const ACCOUNT_NAVIGATION = [
  { name: "Order History", href: "/account/orders", icon: Package },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Account Settings", href: "/account/settings", icon: Settings },
];

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-warm-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-taupe" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-warm-white min-h-screen pt-32 pb-24 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-taupe/20 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-taupe/10 flex items-center justify-center mx-auto text-taupe">
            <UserIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-serif text-obsidian tracking-tight">Account Access</h1>
          <p className="text-xs text-taupe">Please sign in or create an account to view your profile and order history.</p>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/login"
              className="w-full py-3 bg-obsidian text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="w-full py-3 border border-taupe/20 bg-white text-xs font-semibold tracking-widest uppercase text-charcoal hover:bg-warm-white transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "Valued Client";

  return (
    <div className="bg-warm-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-12">
          <h1 className="text-3xl font-serif text-obsidian tracking-tight">My Account</h1>
          <p className="text-taupe mt-2">Welcome back, {displayName}.</p>
          <p className="text-xs text-taupe/80 mt-0.5">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {ACCOUNT_NAVIGATION.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-3 text-sm font-medium text-charcoal hover:bg-taupe/10 hover:text-obsidian rounded-sm transition-colors"
                  >
                    <Icon className="mr-3 h-4 w-4 flex-shrink-0 text-taupe group-hover:text-champagne transition-colors" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-4 py-3 text-sm font-medium text-charcoal hover:bg-taupe/10 hover:text-red-600 rounded-sm transition-colors mt-8"
              >
                <LogOut className="mr-3 h-4 w-4 flex-shrink-0 text-taupe group-hover:text-red-600 transition-colors" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content Area (Profile Overview) */}
          <div className="lg:col-span-3 space-y-8">
            
            <div className="bg-white border border-taupe/20 p-8">
              <h2 className="text-lg font-serif text-obsidian tracking-tight mb-6">Recent Orders</h2>
              <div className="flex flex-col items-center justify-center py-12 text-center bg-warm-white/30 border border-dashed border-taupe/30">
                <Package className="h-8 w-8 text-taupe/40 mb-3" />
                <p className="text-sm text-obsidian font-medium">No recent orders</p>
                <p className="text-xs text-taupe mt-1">You haven&apos;t placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex text-xs font-medium tracking-widest uppercase text-obsidian border-b border-obsidian pb-1 hover:text-champagne hover:border-champagne transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>

            <div className="bg-white border border-taupe/20 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-obsidian tracking-tight">Account Details</h2>
              </div>
              <div className="text-sm text-charcoal space-y-2">
                <p><span className="text-xs uppercase tracking-wider text-taupe font-semibold block">Full Name</span>{displayName}</p>
                <p><span className="text-xs uppercase tracking-wider text-taupe font-semibold block">Email</span>{user.email}</p>
                <p><span className="text-xs uppercase tracking-wider text-taupe font-semibold block">Authentication Provider</span>{user.providerData?.[0]?.providerId || "Firebase Auth"}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
