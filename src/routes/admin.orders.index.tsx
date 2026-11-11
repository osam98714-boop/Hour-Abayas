import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listOrders } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import { statusLabel, type OrderSummary } from "@/lib/types";

export const Route = createFileRoute("/admin/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((err) => setError(errorText(err)));
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-extrabold">الطلبات</h1>
      <p className="mt-2 text-sm text-muted">تصل الطلبات من أجهزة العميلات إلى هنا. لا يُحوَّل الطلب إلى واتساب.</p>
      {error ? <p className="danger mt-4">{error}</p> : null}
      {orders && orders.length === 0 ? <p className="notice mt-6">لا توجد طلبات بعد.</p> : null}
      <div className="mt-4 grid gap-3">
        {(orders ?? []).map((order) => (
          <Link key={order.id} to="/admin/orders/$id" params={{ id: order.id }} className="panel block">
            <b>{order.number}</b>
            <p className="text-sm text-muted">
              {order.customerName} · {order.phone} · {order.fulfillment === "delivery" ? "توصيل" : "استلام"} ·{" "}
              {statusLabel(order.status)} · {riyal(order.totalSar)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
