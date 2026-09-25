"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Plus,
  Eye,
  ExternalLink,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { OrderItem } from "@/src/lib/admin-data";
import { formatCurrency } from "@/src/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("FedEx");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Manual order form state
  const [manualOrder, setManualOrder] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    itemName: "Raw Vietnamese Natural Straight Lace Front Wig",
    length: "22 inch",
    sku: "VNW-22",
    price: 540,
    quantity: 1,
    paymentStatus: "PAID" as OrderItem["paymentStatus"],
    notes: "",
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber || "");
    setCarrierInput(order.carrier || "FedEx");
  };

  const handleUpdateFulfillment = async (
    newStatus: OrderItem["fulfillmentStatus"]
  ) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus: newStatus,
          carrier: carrierInput,
          trackingNumber: trackingInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.order;
        setSelectedOrder(updated);
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrder.customerName || !manualOrder.customerEmail) return;

    setIsSubmittingOrder(true);
    try {
      const totalAmount = manualOrder.price * manualOrder.quantity;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: manualOrder.customerName,
          customerEmail: manualOrder.customerEmail,
          customerPhone: manualOrder.customerPhone,
          shippingAddress: {
            street: manualOrder.street || "Walk-in client",
            city: manualOrder.city || "Atlanta",
            state: manualOrder.state || "GA",
            zipCode: manualOrder.zipCode || "30301",
            country: manualOrder.country,
          },
          items: [
            {
              productId: "custom-prod",
              name: manualOrder.itemName,
              length: manualOrder.length,
              sku: manualOrder.sku,
              price: manualOrder.price,
              quantity: manualOrder.quantity,
              image:
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop",
            },
          ],
          subtotal: totalAmount,
          shippingCost: 0,
          tax: 0,
          total: totalAmount,
          currency: "USD",
          paymentStatus: manualOrder.paymentStatus,
          fulfillmentStatus: "UNFULFILLED",
          notes: manualOrder.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error("Create manual order error:", err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      searchTerm === "" ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || o.fulfillmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const unfulfilledCount = orders.filter(
    (o) => o.fulfillmentStatus === "UNFULFILLED" || o.fulfillmentStatus === "PROCESSING"
  ).length;
  const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-obsidian tracking-tight">
            Orders &amp; Shipments
          </h1>
          <p className="text-xs sm:text-sm text-taupe mt-1">
            Fulfill client purchases, track delivery statuses, and create custom orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center justify-center rounded-md border border-taupe/20 bg-white p-2.5 text-charcoal shadow-2xs hover:bg-warm-white transition"
            title="Refresh orders"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-taupe" : "text-charcoal"}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-obsidian px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs hover:bg-charcoal transition active:scale-[0.98]"
          >
            <Plus className="mr-1.5 h-4 w-4 text-champagne" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Total Sales
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">{orders.length} total orders</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              To Fulfill
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-amber-700 font-medium">
            {unfulfilledCount}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Awaiting dispatch</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe block">
            Average Order Value
          </span>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-obsidian font-medium">
            {formatCurrency(avgOrder)}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Luxury hair basket size</p>
        </div>

        <div className="rounded-xl border border-taupe/20 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-taupe">
              Delivered
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-serif text-emerald-700 font-medium">
            {orders.filter((o) => o.fulfillmentStatus === "DELIVERED").length}
          </div>
          <p className="text-[11px] text-taupe mt-0.5">Completed deliveries</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-taupe/20 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-taupe" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number, customer name or email..."
            className="w-full rounded-md border border-taupe/20 bg-warm-white/40 py-2 pl-9 pr-3 text-xs sm:text-sm text-obsidian placeholder:text-taupe/60 focus:border-obsidian focus:bg-white focus:ring-1 focus:ring-obsidian"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: "ALL", label: "All" },
              { key: "UNFULFILLED", label: "Unfulfilled" },
              { key: "PROCESSING", label: "Processing" },
              { key: "SHIPPED", label: "Shipped" },
              { key: "DELIVERED", label: "Delivered" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === tab.key
                  ? "bg-obsidian text-white shadow-2xs font-semibold"
                  : "bg-taupe/10 text-charcoal hover:bg-taupe/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Presentation */}
      <div className="rounded-xl border border-taupe/20 bg-white shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-taupe">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-taupe" />
            <p className="text-sm font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <ShoppingBag className="h-10 w-10 text-taupe/40 mx-auto mb-3" />
            <h3 className="text-base font-serif font-medium text-obsidian">No orders found</h3>
            <p className="text-xs text-taupe max-w-sm mx-auto mt-1 mb-5">
              {searchTerm || statusFilter !== "ALL"
                ? "No orders match your filter criteria."
                : "No customer orders have been recorded yet."}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5 text-champagne" /> Create Manual Order
            </button>
          </div>
        ) : (
          <>
            {/* ====== MOBILE CARD VIEW (< md) ====== */}
            <div className="md:hidden divide-y divide-taupe/10">
              {filteredOrders.map((order) => {
                const totalItemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <div
                    key={order.id}
                    onClick={() => openOrderDetails(order)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-warm-white/40 active:bg-taupe/5 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-obsidian">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          order.fulfillmentStatus === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-800"
                            : order.fulfillmentStatus === "SHIPPED"
                            ? "bg-blue-50 text-blue-800"
                            : order.fulfillmentStatus === "PROCESSING"
                            ? "bg-purple-50 text-purple-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-obsidian truncate">
                        {order.customerName}
                      </h4>
                      <p className="text-xs text-taupe truncate">{order.customerEmail}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-taupe/10">
                      <span className="text-taupe">
                        {totalItemCount} {totalItemCount === 1 ? "hair item" : "hair items"}
                      </span>
                      <span className="font-serif font-bold text-sm text-obsidian">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-taupe pt-1">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-obsidian font-medium flex items-center gap-0.5">
                        View Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ====== DESKTOP TABLE VIEW (>= md) ====== */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-taupe/15 bg-taupe/5 text-[11px] font-semibold uppercase tracking-wider text-taupe">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Order #</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 px-3">Customer</th>
                    <th className="py-3.5 px-3">Hair Items</th>
                    <th className="py-3.5 px-3">Total</th>
                    <th className="py-3.5 px-3">Payment</th>
                    <th className="py-3.5 px-3">Fulfillment</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {filteredOrders.map((order) => {
                    const totalItemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-warm-white/40 transition cursor-pointer"
                        onClick={() => openOrderDetails(order)}
                      >
                        <td className="py-4 pl-6 pr-3 font-mono font-bold text-obsidian text-xs">
                          {order.orderNumber}
                        </td>

                        <td className="py-4 px-3 text-xs text-taupe">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-4 px-3">
                          <div className="font-medium text-obsidian">{order.customerName}</div>
                          <div className="text-xs text-taupe truncate max-w-xs">
                            {order.customerEmail}
                          </div>
                        </td>

                        <td className="py-4 px-3 text-xs text-charcoal">
                          <span className="font-medium">{totalItemCount} items</span>
                          <span className="text-taupe block text-[11px] truncate max-w-xs">
                            {order.items[0]?.name}
                          </span>
                        </td>

                        <td className="py-4 px-3 font-semibold text-obsidian">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="py-4 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              order.fulfillmentStatus === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-800"
                                : order.fulfillmentStatus === "SHIPPED"
                                ? "bg-blue-50 text-blue-800"
                                : order.fulfillmentStatus === "PROCESSING"
                                ? "bg-purple-50 text-purple-800"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {order.fulfillmentStatus}
                          </span>
                        </td>

                        <td className="py-4 pl-3 pr-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderDetails(order);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-obsidian bg-taupe/10 hover:bg-taupe/20 transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= ORDER DETAILS DRAWER / MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-taupe/15 px-6 py-4 bg-warm-white shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif font-medium text-obsidian">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      selectedOrder.fulfillmentStatus === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-800"
                        : selectedOrder.fulfillmentStatus === "SHIPPED"
                        ? "bg-blue-50 text-blue-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {selectedOrder.fulfillmentStatus}
                  </span>
                </div>
                <p className="text-xs text-taupe mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-taupe hover:text-obsidian rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-taupe/15 bg-warm-white/50 p-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                    Client Details
                  </h4>
                  <p className="text-sm font-medium text-obsidian">{selectedOrder.customerName}</p>
                  <p className="text-xs text-taupe flex items-center gap-1.5 mt-1">
                    <Mail className="h-3 w-3 text-taupe" /> {selectedOrder.customerEmail}
                  </p>
                  {selectedOrder.customerPhone && (
                    <p className="text-xs text-taupe flex items-center gap-1.5 mt-1">
                      <Phone className="h-3 w-3 text-taupe" /> {selectedOrder.customerPhone}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-xs text-obsidian font-medium leading-relaxed">
                    {selectedOrder.shippingAddress.street}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zipCode}
                    <br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
                  Items Purchased ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-taupe/10 border border-taupe/15 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-10 shrink-0 rounded bg-taupe/10 overflow-hidden border border-taupe/15">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[9px] text-taupe">
                              Hair
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-obsidian truncate">{item.name}</p>
                          <p className="text-[11px] text-taupe mt-0.5">
                            Length: <span className="font-semibold text-charcoal">{item.length || "Standard"}</span> • SKU:{" "}
                            <span className="font-mono">{item.sku}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-obsidian">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-taupe">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="rounded-lg border border-taupe/15 bg-warm-white/40 p-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-taupe">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-taupe">
                  <span>Shipping</span>
                  <span>{selectedOrder.shippingCost === 0 ? "Free" : formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-taupe">
                    <span>Taxes</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-obsidian font-bold text-sm pt-2 border-t border-taupe/15">
                  <span>Total Paid</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Tracking & Carrier Controls */}
              <div className="rounded-lg border border-taupe/20 p-4 space-y-3 bg-white">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-champagne" /> Shipping &amp; Tracking
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-taupe mb-1">Carrier</label>
                    <select
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      className="w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                    >
                      <option value="FedEx">FedEx Express</option>
                      <option value="DHL Express">DHL Express</option>
                      <option value="UPS">UPS</option>
                      <option value="USPS">USPS Priority Mail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-taupe mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="e.g. FDX-9821491823"
                      className="w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-taupe/15 px-6 py-4 bg-warm-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateFulfillment("PROCESSING")}
                  className="px-3 py-1.5 rounded-md border border-taupe/30 text-xs font-medium text-charcoal hover:bg-taupe/10 transition"
                >
                  Mark Processing
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateFulfillment("SHIPPED")}
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-700 transition"
                >
                  Mark Shipped
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateFulfillment("DELIVERED")}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 transition"
                >
                  Mark Delivered
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-md border border-taupe/20 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-taupe/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE MANUAL ORDER MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
              <h3 className="text-lg font-serif font-medium text-obsidian">
                Create Client Order
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-taupe hover:text-obsidian rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={manualOrder.customerName}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    placeholder="e.g. Vanessa Moore"
                    className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={manualOrder.customerEmail}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, customerEmail: e.target.value }))
                    }
                    placeholder="vanessa@example.com"
                    className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Product / Hair Item
                </label>
                <input
                  type="text"
                  required
                  value={manualOrder.itemName}
                  onChange={(e) =>
                    setManualOrder((prev) => ({ ...prev, itemName: e.target.value }))
                  }
                  placeholder="e.g. Raw Vietnamese Natural Straight Wig"
                  className="block w-full rounded border border-taupe/30 px-3 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Length
                  </label>
                  <input
                    type="text"
                    value={manualOrder.length}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, length: e.target.value }))
                    }
                    placeholder="22 inch"
                    className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={manualOrder.price}
                    onChange={(e) =>
                      setManualOrder((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    value={manualOrder.quantity}
                    onChange={(e) =>
                      setManualOrder((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="block w-full rounded border border-taupe/30 px-2.5 py-1.5 text-xs text-obsidian focus:border-obsidian focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-taupe/15">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-md border border-taupe/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-warm-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="rounded-md bg-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-charcoal transition disabled:opacity-50"
                >
                  {isSubmittingOrder ? "Recording..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
