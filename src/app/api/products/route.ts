import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/src/lib/products-store";
import { productSchema } from "@/src/lib/validation/product";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const products = await getAllProducts({ status, type, search });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = productSchema.parse(body);
    const newProduct = await createProduct(validated);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.errors?.[0]?.message || error.message || "Failed to create product",
      },
      { status: 400 }
    );
  }
}
