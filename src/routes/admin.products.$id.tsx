import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/product-form";
import { getProduct } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import type { ProductDetail } from "@/lib/types";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<ProductDetail | null | undefined>(undefined);
  const [error, setError] = useState("");
  useEffect(() => {
    getProduct({ data: { id } })
      .then(setProduct)
      .catch((err) => setError(errorText(err)));
  }, [id]);
  if (error) return <p className="danger">{error}</p>;
  if (product === undefined) return <p>جارٍ فتح المنتج…</p>;
  if (!product) return <p>المنتج غير موجود.</p>;
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold">تعديل المنتج</h1>
      <ProductForm initial={product} />
    </div>
  );
}
