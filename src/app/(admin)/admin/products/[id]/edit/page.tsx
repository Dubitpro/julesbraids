import { notFound } from "next/navigation";
import { getProductById } from "@/src/lib/products-store";
import { ProductForm } from "@/src/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
