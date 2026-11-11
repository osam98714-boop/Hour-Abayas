import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreFrame } from "@/components/chrome";
import { readCart, removeLine, setLineQty, subscribeCart } from "@/lib/cart";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import { getProductsByIds } from "@/lib/store.functions";
import type { CartLine, CatalogItem } from "@/lib/types";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "سلة المشتريات | حور" }] }),
  component: CartPage,
});

function CartPage() {
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setLines(readCart());
    sync();
    return subscribeCart(sync);
  }, []);

  useEffect(() => {
    if (!lines) return;
    const ids = [...new Set(lines.map((line) => line.productId))];
    if (!ids.length) {
      setProducts([]);
      return;
    }
    getProductsByIds({ data: { ids } })
      .then(setProducts)
      .catch((err) => setError(errorText(err)));
  }, [lines]);

  const ready = lines ?? [];
  let subtotal = 0;

  return (
    <StoreFrame>
      <div className="wrap py-10">
        <p className="eyebrow">مشترياتكِ</p>
        <h1 className="mt-2 text-4xl font-extrabold">سلة المشتريات</h1>
        <p className="mt-2 text-sm text-muted">السلة تبقى على هذا الجهاز حتى إتمام الطلب. الطلب نفسه يُحفظ للمتجر.</p>
        {lines === null ? <p className="mt-8">جارٍ فتح السلة…</p> : null}
        {lines && ready.length === 0 ? (
          <div className="notice mt-8">
            سلتك فارغة.
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/women" className="btn-line">
                عبايات النساء
              </Link>
              <Link to="/kids" className="btn-line">
                عبايات الأطفال
              </Link>
            </div>
          </div>
        ) : null}
        <div className="mt-6 grid gap-3">
          {ready.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            const stock = product?.sizes.find((size) => size.size === line.size)?.qty ?? 0;
            if (product) subtotal += product.priceSar * line.qty;
            return (
              <article key={`${line.productId}-${line.size}`} className="panel flex flex-wrap items-center justify-between gap-4">
                <div>
                  <b>{product?.name ?? "منتج لم يعد متاحًا"}</b>
                  <p className="text-sm text-muted">
                    المقاس {line.size}
                    {product ? ` · ${riyal(product.priceSar)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="size-btn"
                    onClick={() => {
                      const result = setLineQty(line.productId, line.size, line.qty - 1, stock);
                      setError(result.ok ? "" : result.message);
                    }}
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center font-bold tabular-nums">{line.qty}</span>
                  <button
                    type="button"
                    className="size-btn"
                    onClick={() => {
                      const result = setLineQty(line.productId, line.size, line.qty + 1, stock);
                      setError(result.ok ? "" : result.message);
                    }}
                  >
                    +
                  </button>
                  <button type="button" className="btn-line" onClick={() => removeLine(line.productId, line.size)}>
                    حذف
                  </button>
                  <b className="price">{product ? riyal(product.priceSar * line.qty) : ""}</b>
                </div>
              </article>
            );
          })}
        </div>
        {error ? <p className="danger mt-4">{error}</p> : null}
        {ready.length > 0 ? (
          <div className="mt-8">
            <p className="text-xl font-extrabold">المجموع {riyal(subtotal)}</p>
            <p className="mt-1 text-sm text-muted">رسوم التوصيل تُحسب في إتمام الطلب، وتبدأ من السعر الأساسي داخل مكة.</p>
            <Link to="/checkout" className="btn-gold mt-4">
              إتمام الطلب
            </Link>
          </div>
        ) : null}
      </div>
    </StoreFrame>
  );
}
