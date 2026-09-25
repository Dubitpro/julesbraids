import { NextRequest, NextResponse } from "next/server";
import { getCollections, createCollection } from "@/src/lib/admin-data";

export async function GET(req: NextRequest) {
  try {
    const collections = await getCollections();
    return NextResponse.json({ success: true, collections });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, isFeatured, status } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const newCol = await createCollection({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: description || "",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1200&auto=format&fit=crop",
      isFeatured: isFeatured ?? false,
      status: status || "ACTIVE",
      productCount: 0,
    });

    return NextResponse.json({ success: true, collection: newCol });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
