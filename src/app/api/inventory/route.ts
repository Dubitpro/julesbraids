import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/src/lib/products-store";
import { updateVariantStock } from "@/src/lib/admin-data";

export async function GET(req: NextRequest) {
  try {
    const products = await getAllProducts();
    const inventoryItems: Array<{
      productId: string;
      productName: string;
      productSlug: string;
      productType: string;
      productImage?: string;
      variantId?: string;
      variantIndex: number;
      sku: string;
      length?: string;
      price: number;
      stock: number;
      status: string;
    }> = [];

    products.forEach((p) => {
      (p.variants || []).forEach((v, index) => {
        inventoryItems.push({
          productId: p.id,
          productName: p.name,
          productSlug: p.slug,
          productType: p.productType,
          productImage: p.images?.[0],
          variantId: v.id,
          variantIndex: index,
          sku: v.sku,
          length: v.length,
          price: v.price,
          stock: Number(v.stock) || 0,
          status: p.status,
        });
      });
    });

    return NextResponse.json({ success: true, items: inventoryItems });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, variantId, variantIndex, stock } = body;

    if (!productId || typeof stock !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing productId or stock number" },
        { status: 400 }
      );
    }

    const updated = await updateVariantStock(
      productId,
      variantId !== undefined ? variantId : variantIndex,
      stock
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
