import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/src/lib/admin-data";
import { getAllProducts } from "@/src/lib/products-store";

export async function GET(req: NextRequest) {
  try {
    const categories = await getCategories();
    const products = await getAllProducts();

    // Attach real live product count for each category
    const categoriesWithCount = categories.map((cat) => {
      const count = products.filter((p) => {
        if (cat.productType === "RAW") {
          return p.hairOrigin?.toLowerCase().includes("raw") || p.name.toLowerCase().includes("raw");
        }
        return p.productType === cat.productType;
      }).length;
      return { ...cat, productCount: count };
    });

    return NextResponse.json({ success: true, categories: categoriesWithCount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, productType, isActive } = body;

    if (!name || !productType) {
      return NextResponse.json(
        { success: false, error: "Name and productType are required" },
        { status: 400 }
      );
    }

    const newCat = await createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: description || "",
      imageUrl: imageUrl || "",
      productType,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, category: newCat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
