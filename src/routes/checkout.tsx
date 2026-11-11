import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreFrame, useChrome } from "@/components/chrome";
import { clearCart, readCart } from "@/lib/cart";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import { getProductsByIds, placeOrder } from "@/lib/store.functions";
import type { CartLine, CatalogItem } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "إتمام الطلب | حور" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const chrome = useChrome();
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ number: string; totalSar: number; deliveryFeeSar: number; feeIsEstimate: boolean } | null>(
    null,
  );

  useEffect(() => {
    const current = readCart();
    setLines(current);
    const ids = [...new Set(current.map((line) => line.productId))];
    if (ids.length) getProductsByIds({ data: { ids } }).then(setProducts).catch((err) => setError(errorText(err)));
  }, []);

  const subtotal = (lines ?? []).reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product ? product.priceSar * line.qty : 0);
  }, 0);
  const fee = fulfillment === "delivery" ? chrome.deliveryBaseSar : 0;

  if (done) {
    return (
      <StoreFrame>
        <div className="wrap max-w-xl py-12">
          <p className="eyebrow">تم استلام الطلب</p>
          <h1 className="mt-2 text-4xl font-extrabold">{done.number}</h1>
          <div className="panel mt-6">
            <p>حُفظ الطلب في لوحة الإدارة، ولن يُحوَّل إلى واتساب.</p>
            <p className="mt-2">الإجمالي {riyal(done.totalSar)}</p>
            {done.feeIsEstimate ? (
              <p className="mt-2 text-sm text-muted">
                رسوم التوصيل الحالية {riyal(done.deliveryFeeSar)} تقدير أساسي، وقد تُعدَّل حسب بُعد الموقع قبل التأكيد.
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">الاستلام من المنزل مجاني.</p>
            )}
            <p className="mt-2 text-sm">الدفع عند الاستلام. الدفع الإلكتروني غير مفعّل بعد.</p>
          </div>
          <Link to="/" className="btn-gold mt-6">
            العودة للمتجر
          </Link>
        </div>
      </StoreFrame>
    );
  }

  return (
    <StoreFrame>
      <div className="wrap max-w-xl py-10">
        <p className="eyebrow">خطوة أخيرة</p>
        <h1 className="mt-2 text-4xl font-extrabold">إتمام الطلب</h1>
        <p className="mt-2 text-sm text-muted">يمكنك الشراء كضيفة دون إنشاء حساب. الطلب يصل إلى إدارة حور.</p>
        {lines && lines.length === 0 ? (
          <div className="notice mt-6">
            السلة فارغة. <Link to="/women">تصفحي العبايات</Link>
          </div>
        ) : (
          <form
            className="panel mt-6 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!lines?.length) return;
              const form = new FormData(event.currentTarget);
              setBusy(true);
              setError("");
              try {
                const result = await placeOrder({
                  data: {
                    name: String(form.get("name") ?? ""),
                    phone: String(form.get("phone") ?? ""),
                    address: String(form.get("address") ?? ""),
                    fulfillment,
                    items: lines,
                  },
                });
                clearCart();
                setDone(result);
              } catch (err) {
                setError(errorText(err));
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="field">
              الاسم الكامل
              <input name="name" required minLength={2} />
            </label>
            <label className="field">
              رقم التواصل
              <input name="phone" type="tel" required placeholder="05xxxxxxxx" />
            </label>
            <label className="field">
              طريقة الاستلام
              <select
                name="fulfillment"
                value={fulfillment}
                onChange={(event) => setFulfillment(event.target.value as "delivery" | "pickup")}
              >
                <option value="delivery">توصيل داخل مكة — يبدأ من {riyal(chrome.deliveryBaseSar)}</option>
                <option value="pickup">استلام من المنزل — مجاني</option>
              </select>
            </label>
            <label className="field">
              {fulfillment === "delivery" ? "الحي والعنوان داخل مكة" : "ملاحظة للاستلام (اختياري)"}
              <textarea name="address" required={fulfillment === "delivery"} />
            </label>
            <label className="field">
              طريقة الدفع
              <select name="payment" defaultValue="cod" disabled>
                <option value="cod">نقدًا عند الاستلام</option>
              </select>
            </label>
            <p className="notice">
              الدفع الإلكتروني غير مفعّل حاليًا، ولا توجد بوابة دفع وهمية. يمكن ربط بوابة لاحقًا بعد التأكد من متطلباتها.
              {fulfillment === "delivery"
                ? ` رسوم التوصيل الأساسية ${riyal(chrome.deliveryBaseSar)}، وقد تزيد حسب بُعد الموقع.`
                : " الاستلام من المنزل مجاني."}
            </p>
            <p className="font-bold">
              المنتجات {riyal(subtotal)} · التوصيل {riyal(fee)} · الإجمالي {riyal(subtotal + fee)}
            </p>
            {error ? <p className="danger">{error}</p> : null}
            <button className="btn-gold" type="submit" disabled={busy || !lines}>
              {busy ? "جارٍ حفظ الطلب…" : "تأكيد الطلب"}
            </button>
          </form>
        )}
      </div>
    </StoreFrame>
  );
}
