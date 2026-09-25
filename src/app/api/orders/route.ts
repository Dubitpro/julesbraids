import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/src/lib/admin-data";

export async function GET(req: NextRequest) {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      currency,
      paymentStatus,
      fulfillmentStatus,
      notes,
    } = body;

    if (!customerName || !customerEmail || !items || !total) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const newOrder = await createOrder({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      shippingAddress: shippingAddress || {
        street: "Standard Delivery",
        city: "City",
        state: "State",
        zipCode: "00000",
        country: "United States",
      },
      items,
      subtotal: subtotal || total,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      total,
      currency: currency || "USD",
      paymentStatus: paymentStatus || "PAID",
      fulfillmentStatus: fulfillmentStatus || "UNFULFILLED",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
