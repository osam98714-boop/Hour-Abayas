import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getOverview } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import { riyal } from "@/lib/money";
import type { Overview } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

function OverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getOverview()
      .then(setData)
      .catch((err) => setError(errorText(err)));
  }, []);
  if (error) return <p className="danger">{error}</p>;
  if (!data) return <p>جارٍ تحميل النظرة العامة…</p>;
  return (
    <div>
      <h1 className="text-3xl font-extrabold">نظرة عامة</h1>
      <p className="mt-2 text-sm text-muted">أرقام المنتجات والطلبات المحفوظة في قاعدة المتجر، وليست بيانات تجريبية.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="المنتجات" value={String(data.products)} />
        <Stat label="عبايات النساء" value={String(data.women)} />
        <Stat label="عبايات الأطفال" value={String(data.kids)} />
        <Stat label="الطلبات" value={String(data.orders)} />
        <Stat label="طلبات جديدة" value={String(data.newOrders)} />
        <Stat label="مبيعات غير الملغاة" value={riyal(data.salesSar)} />
      </div>
      <section className="panel mt-6">
        <h2 className="font-bold">مقاسات قاربت على النفاد</h2>
        {data.lowStock.length === 0 ? (
          <p className="mt-2 text-sm text-muted">لا توجد مقاسات كميتها ٢ أو أقل.</p>
        ) : (
          <ul className="mt-3 grid gap-2 text-sm">
            {data.lowStock.map((row) => (
              <li key={`${row.productName}-${row.size}`}>
                {row.productName} · {row.size} · المتبقي {row.qty}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/admin/products" className="btn-line">
            إدارة المنتجات
          </Link>
          <Link to="/admin/orders" className="btn-line">
            إدارة الطلبات
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="text-sm text-muted">{label}</span>
      <b>{value}</b>
    </div>
  );
}
