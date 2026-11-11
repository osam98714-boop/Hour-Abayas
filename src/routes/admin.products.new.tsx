import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/product-form";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold">منتج جديد</h1>
      <ProductForm />
    </div>
  );
}
