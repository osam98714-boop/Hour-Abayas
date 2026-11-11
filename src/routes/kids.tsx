import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { listCatalog } from "@/lib/store.functions";

export const Route = createFileRoute("/kids")({
  loader: () => listCatalog({ data: { category: "kids" } }),
  head: () => ({ meta: [{ title: "عبايات الأطفال | حور" }] }),
  component: KidsPage,
});

function KidsPage() {
  const items = Route.useLoaderData();
  return (
    <CatalogPage
      kicker="مجموعة الأطفال"
      title="عبايات الأطفال"
      intro="عبايات الأطفال من مشغل العائلة. اختاري المقاس لتصفية المتوفر فقط."
      items={items}
    />
  );
}
