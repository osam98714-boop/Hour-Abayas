import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { deleteProduct, listAdminProducts } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import type { CatalogItem } from "@/lib/types";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsPage,
});

function ProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function load() {
    listAdminProducts()
      .then(setItems)
      .catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">المنتجات</h1>
        <Link to="/admin/products/new" className="btn-gold">
          منتج جديد
        </Link>
      </div>
      {error ? <p className="danger mt-4">{error}</p> : null}
      {items && items.length === 0 ? (
        <p className="notice mt-6">لا توجد منتجات بعد. أضيفي أول عباية حقيقية عندما تكون صورها وتفاصيلها جاهزة.</p>
      ) : null}
      <div className="mt-4 grid gap-3">
        {(items ?? []).map((item) => {
          const stock = item.sizes.reduce((sum, size) => sum + size.qty, 0);
          return (
            <article key={item.id} className="panel flex flex-wrap items-center justify-between gap-3">
              <div>
                <b>{item.name}</b>
                <p className="text-sm text-muted">
                  {item.category === "women" ? "نساء" : "أطفال"} · {riyal(item.priceSar)} · المخزون {stock}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/products/$id" params={{ id: item.id }} className="btn-line">
                  تعديل
                </Link>
                {pendingDelete === item.id ? (
                  <button
                    type="button"
                    className="btn-ink"
                    onClick={async () => {
                      await deleteProduct({ data: { id: item.id } });
                      setPendingDelete(null);
                      await router.invalidate();
                      load();
                    }}
                  >
                    تأكيد الحذف
                  </button>
                ) : (
                  <button type="button" className="btn-line" onClick={() => setPendingDelete(item.id)}>
                    حذف
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
