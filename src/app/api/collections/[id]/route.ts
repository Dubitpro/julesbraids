import { NextRequest, NextResponse } from "next/server";
import { updateCollection, deleteCollection } from "@/src/lib/admin-data";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateCollection(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, collection: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteCollection(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
