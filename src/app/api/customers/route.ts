import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/src/lib/admin-data";

export async function GET(req: NextRequest) {
  try {
    const customers = await getCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, country, tier, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newCustomer = await createCustomer({
      name,
      email,
      phone: phone || "",
      city: city || "United States",
      country: country || "United States",
      tier: tier || "STANDARD",
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString().split("T")[0],
      notes: notes || "",
    });

    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
