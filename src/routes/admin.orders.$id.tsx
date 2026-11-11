import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getOrder, updateOrder } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import { ORDER_STATUSES, type OrderDetail, type OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/orders/$id")({
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<OrderDetail | null | undefined>(undefined);
  const [status, setStatus] = useState<OrderStatus>("new");
  const [fee, setFee] = useState("0");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getOrder({ data: { id } })
      .then((next) => {
        setOrder(next);
        if (next) {
          setStatus(next.status);
          setFee(String(next.deliveryFeeSar));
          setNote(next.adminNote);
        }
      })
      .catch((err) => setError(errorText(err)));
  }, [id]);

  if (error && !order) return <p className="danger">{error}</p>;
  if (order === undefined) return <p>جارٍ فتح الطلب…</p>;
  if (!order) return <p>الطلب غير موجود.</p>;

  return (
    <div className="grid gap-4">
      <div>
        <p className="eyebrow">{order.number}</p>
        <h1 className="text-3xl font-extrabold">{order.customerName}</h1>
      </div>
      <section className="panel text-sm leading-7">
        <p>الجوال: {order.phone}</p>
        <p>العنوان: {order.address || "—"}</p>
        <p>الاستلام: {order.fulfillment === "delivery" ? "توصيل داخل مكة" : "استلام من المنزل"}</p>
        <p>الدفع: {order.paymentMethod === "cod" ? "عند الاستلام" : order.paymentMethod}</p>
        <p>تاريخ الطلب: {order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : ""}</p>
      </section>
      <section className="panel">
        <h2 className="font-bold">المنتجات</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                {item.productName} · {item.size} · ×{item.qty}
              </span>
              <span className="price">{riyal(item.unitPriceSar * item.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">المنتجات {riyal(order.subtotalSar)}</p>
        <p className="text-sm">
          التوصيل {riyal(order.deliveryFeeSar)}
          {order.feeIsEstimate ? " (تقدير، لم يُؤكد بعد)" : ""}
        </p>
        <p className="font-bold">الإجمالي {riyal(order.totalSar)}</p>
      </section>
      <form
        className="panel grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          setMessage("");
          try {
            await updateOrder({
              data: { id: order.id, status, deliveryFeeSar: Number(fee), adminNote: note },
            });
            const next = await getOrder({ data: { id } });
            setOrder(next);
            setMessage(status === "cancelled" ? "أُلغي الطلب وأُعيد مخزون المقاسات." : "تم تحديث الطلب.");
          } catch (err) {
            setError(errorText(err));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="field">
          الحالة
          <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
            {ORDER_STATUSES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          رسوم التوصيل بالريال
          <input value={fee} type="number" min={0} max={500} onChange={(event) => setFee(event.target.value)} />
        </label>
        <p className="text-sm text-muted">عدّلي الرسوم إذا زاد التوصيل بسبب بُعد الحي. الإلغاء يعيد كمية كل مقاس.</p>
        <label className="field">
          ملاحظة داخلية
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        {error ? <p className="danger">{error}</p> : null}
        {message ? <p className="text-sm font-semibold">{message}</p> : null}
        <button className="btn-gold" disabled={busy} type="submit">
          {busy ? "جارٍ الحفظ…" : "حفظ حالة الطلب"}
        </button>
      </form>
    </div>
  );
}
