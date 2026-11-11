import { useMemo, useState } from "react";
import { ProductCard, EmptyCollection } from "@/components/product-card";
import { StoreFrame } from "@/components/chrome";
import type { CatalogItem } from "@/lib/types";
import { sortSizes } from "@/lib/types";

export function CatalogPage({
  kicker,
  title,
  intro,
  items,
}: {
  kicker: string;
  title: string;
  intro: string;
  items: CatalogItem[];
}) {
  const [size, setSize] = useState("");
  const sizes = useMemo(() => {
    const labels = new Set<string>();
    for (const item of items) for (const row of item.sizes) labels.add(row.size);
    return sortSizes([...labels].map((label) => ({ size: label }))).map((row) => row.size);
  }, [items]);
  const visible = size
    ? items.filter((item) => item.sizes.some((row) => row.size === size && row.qty > 0))
    : items;

  return (
    <StoreFrame>
      <div className="wrap py-10">
        <p className="eyebrow">{kicker}</p>
        <h1 className="mt-2 text-4xl font-extrabold">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted">{intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className="size-btn" data-on={size === "" ? "true" : "false"} onClick={() => setSize("")}>
            كل المقاسات
          </button>
          {sizes.map((label) => (
            <button
              key={label}
              type="button"
              className="size-btn"
              data-on={size === label ? "true" : "false"}
              onClick={() => setSize(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          عند اختيار مقاس تظهر فقط العبايات التي يتوفر فيها هذا المقاس فعلًا.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {visible.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
        {items.length === 0 ? (
          <EmptyCollection>لا توجد منتجات في هذا القسم بعد. تظهر هنا فور إضافتها من لوحة الإدارة.</EmptyCollection>
        ) : null}
        {items.length > 0 && visible.length === 0 ? (
          <EmptyCollection>لا توجد عباية متوفر فيها المقاس {size} حاليًا.</EmptyCollection>
        ) : null}
      </div>
    </StoreFrame>
  );
}
