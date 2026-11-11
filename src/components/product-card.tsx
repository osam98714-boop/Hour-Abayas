import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { riyal } from "@/lib/money";
import type { Spot } from "@/lib/types";

export function ProductCard({ item }: { item: Spot }) {
  return (
    <article className="card">
      <Link to="/product/$id" params={{ id: item.id }} className="block">
        {item.cover ? (
          <img src={item.cover} alt={item.name} />
        ) : (
          <div className="ph" role="img" aria-label="بانتظار صورة المنتج">
            <span>
              ح<span className="mt-2 block text-xs font-medium tracking-normal text-muted">بانتظار الصورة</span>
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-bold">{item.name}</h3>
        <p className="price">{riyal(item.priceSar)}</p>
        <Link to="/product/$id" params={{ id: item.id }} className="btn-line mt-auto">
          عرض التفاصيل
        </Link>
      </div>
    </article>
  );
}

export function EmptyCollection({ children }: { children: ReactNode }) {
  return <div className="notice">{children}</div>;
}
