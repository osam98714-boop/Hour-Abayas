import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreFrame } from "@/components/chrome";
import { EmptyCollection, ProductCard } from "@/components/product-card";
import { getHome } from "@/lib/store.functions";
import type { Spot } from "@/lib/types";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return (
    <StoreFrame>
      <section className="wrap pt-6">
        <div className="hero-grid grid items-center gap-8 bg-ink px-6 py-12 text-paper md:grid-cols-[1.15fr_0.85fr] md:px-14 md:py-16">
          <div>
            <p className="text-sm font-bold tracking-wide text-gold">أناقة .. بكل تفاصيلها</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              تفاصيل تصنع
              <span className="mt-1 block text-gold">أناقتكِ</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-paper/80">
              عبايات النساء والأطفال تُفصَّل محليًا في مكة المكرمة على يد أفراد من عائلتنا. اختاري التصميم، ثم المقاس المتوفر فعلًا.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/women" className="btn-gold">
                عبايات النساء
              </Link>
              <Link to="/kids" className="btn-line btn-ghost">
                عبايات الأطفال
              </Link>
            </div>
            <p className="mt-6 text-sm text-paper/70">التوصيل داخل مكة يبدأ من 15 ريالًا · الاستلام من المنزل مجاني</p>
          </div>
          <div className="relative grid min-h-64 place-items-center">
            <div className="grid h-56 w-56 place-items-center rounded-full border border-gold/50 text-7xl font-bold text-gold">
              ح
            </div>
            <p className="absolute bottom-2 text-center text-xs tracking-widest text-gold">HOUR ABAYAS</p>
          </div>
        </div>
      </section>
      <Shelf
        id="women"
        kicker="01"
        title="عبايات النساء"
        href="/women"
        items={data.women}
        empty="لا توجد عبايات نساء مضافة بعد. عند إضافتها من الإدارة تظهر هنا مجموعة عشوائية من التشكيلة."
      />
      <Shelf
        id="kids"
        kicker="02"
        title="عبايات الأطفال"
        href="/kids"
        items={data.kids}
        empty="لا توجد عبايات أطفال مضافة بعد. عند إضافتها من الإدارة تظهر هنا مجموعة عشوائية من التشكيلة."
      />
    </StoreFrame>
  );
}

function Shelf({
  id,
  kicker,
  title,
  href,
  items,
  empty,
}: {
  id: string;
  kicker: string;
  title: string;
  href: "/women" | "/kids";
  items: Spot[];
  empty: string;
}) {
  return (
    <section id={id} className="wrap py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2 className="mt-1 text-3xl font-extrabold">{title}</h2>
        </div>
        <Link to={href} className="btn-line">
          عرض الكل
        </Link>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyCollection>{empty}</EmptyCollection>
      )}
    </section>
  );
}
