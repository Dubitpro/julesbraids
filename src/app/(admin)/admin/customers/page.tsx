"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  MapPin,
  Crown,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  Edit2,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CustomerItem } from "@/src/lib/admin-data";
import { formatCurrency } from "@/src/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "United States",
    tier: "STANDARD" as CustomerItem["tier"],
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => [data.customer, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error("Save customer error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNotes = async (customerId: string, notes: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? { ...c, notes } : c))
        );
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer((prev) => (prev ? { ...prev, notes } : null));
        }
      }
    } catch (err) {
      console.error("Update notes error:", err);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      searchTerm === "" ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesTier = tierFilter === "ALL" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalClients = customers.length;
  const vipCount = customers.filter((c) => c.tier === "VIP").length;
  const totalClientValue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Maintain salon contacts, VIP buyers, and client hair preference records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCustomers}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh client list"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-taupe" : "text-charcoal"}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-obsidian px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98]"
          >
            <Plus className="mr-1.5 h-4 w-4 text-champagne" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Total Clients
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {totalClients}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Registered customer profiles</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              VIP Tier Buyers
            </span>
            <Crown className="h-4 w-4 text-champagne" />
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-champagne-dark font-medium">
            {vipCount}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">High volume luxury buyers</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Lifetime Client Spend
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {formatCurrency(totalClientValue)}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Catalog revenue generated</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Average Spend / Client
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {formatCurrency(totalClients > 0 ? totalClientValue / totalClients : 0)}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Per client average</p>
        </div>
      </div>

      {/* Search & Tier Filter */}
      <div className="rounded-xl border border-taupe/20 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone or city..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: "ALL", label: "All Tiers" },
              { key: "VIP", label: "VIP" },
              { key: "GOLD", label: "Gold" },
              { key: "STANDARD", label: "Standard" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTierFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                tierFilter === tab.key
                  ? "bg-obsidian text-white shadow-2xs font-semibold"
                  : "bg-taupe/10 text-charcoal hover:bg-taupe/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Presentation */}
      <div className="rounded-xl border border-taupe/20 bg-white shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-taupe">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
            <p className="text-sm font-medium">Loading client directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
            <h3 className="text-base font-serif font-medium text-obsidian">No clients found</h3>
            <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
              {searchTerm || tierFilter !== "ALL"
                ? "No clients match your filter criteria."
                : "Record your salon clients and online shoppers."}
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5 text-champagne" /> Add First Client
            </button>
          </div>
        ) : (
          <>
            {/* ====== MOBILE CARDS VIEW (< md) ====== */}
            <div className="md:hidden divide-y divide-taupe/10">
              {filteredCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="p-4 space-y-3 cursor-pointer hover:bg-warm-white/40 active:bg-taupe/5 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-champagne text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
                        {cust.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-obsidian truncate">
                          {cust.name}
                        </h4>
                        <p className="text-xs text-taupe truncate">{cust.email}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                        cust.tier === "VIP"
                          ? "bg-champagne/20 text-champagne-dark border border-champagne/40"
                          : cust.tier === "GOLD"
                          ? "bg-amber-50 text-amber-800 border border-amber-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cust.tier}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-taupe/10">
                    <span className="text-taupe">
                      {cust.totalOrders} {cust.totalOrders === 1 ? "order" : "orders"}
                    </span>
                    <span className="font-semibold text-obsidian">
                      {formatCurrency(cust.totalSpent)} spent
                    </span>
                  </div>

                  {cust.notes && (
                    <p className="text-[11px] text-charcoal/70 bg-warm-white/70 p-2 rounded border border-taupe/10 italic line-clamp-1">
                      &quot;{cust.notes}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ====== DESKTOP TABLE VIEW (>= md) ====== */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-taupe/15 bg-taupe/5 text-[11px] font-semibold uppercase tracking-wider text-taupe">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Client</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Tier</th>
                    <th className="py-3.5 px-3">Orders</th>
                    <th className="py-3.5 px-3">Total Spent</th>
                    <th className="py-3.5 px-3">Last Active</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {filteredCustomers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="hover:bg-warm-white/40 transition cursor-pointer"
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-champagne text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-2xs">
                            {cust.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-obsidian block">
                              {cust.name}
                            </span>
                            <span className="text-xs text-taupe truncate block">
                              {cust.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-xs text-taupe">
                        {cust.city}, {cust.country}
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                            cust.tier === "VIP"
                              ? "bg-champagne/20 text-champagne-dark border border-champagne/40"
                              : cust.tier === "GOLD"
                              ? "bg-amber-50 text-amber-800 border border-amber-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {cust.tier}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-xs font-medium text-obsidian">
                        {cust.totalOrders}
                      </td>

                      <td className="py-4 px-3 font-semibold text-obsidian">
                        {formatCurrency(cust.totalSpent)}
                      </td>

                      <td className="py-4 px-3 text-xs text-taupe">
                        {cust.lastOrderDate}
                      </td>

                      <td className="py-4 pl-3 pr-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(cust);
                          }}
                          className="px-2.5 py-1 rounded text-xs font-medium text-obsidian bg-taupe/10 hover:bg-taupe/20 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= CUSTOMER PROFILE MODAL ================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden my-8 space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-taupe/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-champagne text-white flex items-center justify-center font-serif text-lg font-bold">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-medium text-obsidian">
                    {selectedCustomer.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      selectedCustomer.tier === "VIP"
                        ? "bg-champagne/20 text-champagne-dark"
                        : "bg-taupe/10 text-charcoal"
                    }`}
                  >
                    {selectedCustomer.tier} Client
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-taupe hover:text-obsidian rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={`mailto:${selectedCustomer.email}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-taupe/20 bg-warm-white/50 text-xs font-medium text-charcoal hover:bg-taupe/10 transition"
              >
                <Mail className="h-3.5 w-3.5 text-champagne" />
                <span>Send Email</span>
              </a>
              {selectedCustomer.phone && (
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-taupe/20 bg-warm-white/50 text-xs font-medium text-charcoal hover:bg-taupe/10 transition"
                >
                  <Phone className="h-3.5 w-3.5 text-champagne" />
                  <span>Call Phone</span>
                </a>
              )}
            </div>

            {/* Financial History Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-taupe/15 p-3 bg-warm-white/40">
                <span className="text-[10px] uppercase font-semibold text-taupe block">
                  Total Spent
                </span>
                <span className="text-lg font-serif font-bold text-obsidian">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </span>
              </div>
              <div className="rounded-lg border border-taupe/15 p-3 bg-warm-white/40">
                <span className="text-[10px] uppercase font-semibold text-taupe block">
                  Total Orders
                </span>
                <span className="text-lg font-serif font-bold text-obsidian">
                  {selectedCustomer.totalOrders}
                </span>
              </div>
            </div>

            {/* Client Notes & Hair Preferences */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                Hair Texture &amp; Stylist Notes
              </label>
              <textarea
                rows={3}
                defaultValue={selectedCustomer.notes || ""}
                onBlur={(e) => handleUpdateNotes(selectedCustomer.id, e.target.value)}
                placeholder="Add private stylist notes on hair lengths, lace tone, or bundle deals..."
                className="w-full rounded border border-taupe/30 p-2.5 text-xs text-obsidian focus:border-obsidian focus:ring-0 leading-relaxed"
              />
              <p className="text-[10px] text-taupe mt-1">Changes are saved automatically on blur.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-md bg-obsidian text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD NEW CUSTOMER MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
              <h3 className="text-lg font-serif font-medium text-obsidian">
                Add New Client Record
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-taupe hover:text-obsidian rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kiara Jenkins"
                  className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="kiara@example.com"
                    className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Atlanta, GA"
                    className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tier: e.target.value as CustomerItem["tier"],
                      }))
                    }
                    className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  >
                    <option value="STANDARD">Standard Client</option>
                    <option value="GOLD">Gold Client</option>
                    <option value="VIP">VIP Client</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Stylist Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Prefers natural straight Vietnamese bundles or custom lace caps..."
                  className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-taupe/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border border-taupe/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-warm-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
