"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Check,
  RefreshCw,
  Store,
  Truck,
  ShieldAlert,
  Bell,
  Sparkles,
  Info,
} from "lucide-react";
import { StoreSettings } from "@/src/lib/admin-data";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "JulesBraids & Hairs",
    contactEmail: "contact@julesbraids.com",
    supportPhone: "+1 (800) 585-3742",
    currency: "USD",
    timezone: "America/New_York",
    announcementText:
      "Experience 100% Virgin Vietnamese, Mexican, Cambodian & Chinese Hair • Free Worldwide Shipping on Orders $300+",
    showAnnouncement: true,
    lowStockThreshold: 5,
    autoHideOutOfStock: false,
    standardShippingFee: 15,
    expressShippingFee: 35,
    freeShippingThreshold: 300,
    hygienePolicy:
      "For hygiene and sanitary standards, all hair bundles, lace closures, and wigs must be in their original unopened security ties and unworn condition to qualify for exchanges within 14 days.",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Configure store preferences, shipping rates, inventory thresholds, and policies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || loading}
          className="inline-flex items-center justify-center rounded-md bg-obsidian px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="mr-1.5 h-4 w-4 animate-spin text-champagne" />
          ) : (
            <Save className="mr-1.5 h-4 w-4 text-champagne" />
          )}
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {showSavedToast && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-950">
              Settings updated successfully and synchronized with your store.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-taupe">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
          <p className="text-sm font-medium">Loading store settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Section 1: Store General Identity */}
          <div className="rounded-xl border border-taupe/20 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-taupe/15 pb-3">
              <Store className="h-4 w-4 text-champagne" />
              <h2 className="text-base font-serif font-medium text-obsidian">
                Store Identity &amp; Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Store Legal Brand Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Client Support Phone
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Store Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="CAD">CAD ($ - Canadian Dollar)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Announcement Bar */}
          <div className="rounded-xl border border-taupe/20 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-taupe/15 pb-3">
              <Sparkles className="h-4 w-4 text-champagne" />
              <h2 className="text-base font-serif font-medium text-obsidian">
                Storefront Top Announcement
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showAnnouncement"
                  checked={settings.showAnnouncement}
                  onChange={(e) =>
                    setSettings({ ...settings, showAnnouncement: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <label htmlFor="showAnnouncement" className="text-xs text-charcoal font-medium">
                  Display announcement ticker across storefront header
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) =>
                    setSettings({ ...settings, announcementText: e.target.value })
                  }
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Rates */}
          <div className="rounded-xl border border-taupe/20 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-taupe/15 pb-3">
              <Truck className="h-4 w-4 text-champagne" />
              <h2 className="text-base font-serif font-medium text-obsidian">
                Shipping &amp; Fulfillment Rates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Standard Shipping ($)
                </label>
                <input
                  type="number"
                  value={settings.standardShippingFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      standardShippingFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Express Shipping ($)
                </label>
                <input
                  type="number"
                  value={settings.expressShippingFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      expressShippingFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Free Shipping Over ($)
                </label>
                <input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeShippingThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Inventory & Hygiene Policy */}
          <div className="rounded-xl border border-taupe/20 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-taupe/15 pb-3">
              <ShieldAlert className="h-4 w-4 text-champagne" />
              <h2 className="text-base font-serif font-medium text-obsidian">
                Inventory Alerts &amp; Sanitary Policy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Low Stock Threshold Units
                </label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lowStockThreshold: parseInt(e.target.value, 10) || 5,
                    })
                  }
                  className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
                <p className="text-[11px] text-taupe mt-1">
                  Triggers amber &quot;Low Stock&quot; indicator in inventory dashboard.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="autoHide"
                  checked={settings.autoHideOutOfStock}
                  onChange={(e) =>
                    setSettings({ ...settings, autoHideOutOfStock: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-taupe/30 text-obsidian focus:ring-obsidian"
                />
                <label htmlFor="autoHide" className="text-xs text-charcoal font-medium">
                  Auto-hide products with 0 total inventory from storefront
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                Hair Hygiene &amp; Exchange Policy
              </label>
              <textarea
                rows={3}
                value={settings.hygienePolicy}
                onChange={(e) => setSettings({ ...settings, hygienePolicy: e.target.value })}
                className="block w-full rounded-md border border-taupe/30 bg-white px-3.5 py-2 text-xs sm:text-sm text-obsidian focus:border-obsidian focus:ring-1 focus:ring-obsidian leading-relaxed"
              />
            </div>
          </div>

          {/* Sticky Save CTA on mobile */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-obsidian px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition disabled:opacity-50 shadow-sm"
            >
              <Save className="mr-2 h-4 w-4 text-champagne" />
              {isSaving ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
