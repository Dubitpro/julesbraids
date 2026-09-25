import { NextRequest, NextResponse } from "next/server";
import { updateCustomer } from "@/src/lib/admin-data";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateCustomer(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, customer: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
