import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { listCatalog } from "@/lib/store.functions";

export const Route = createFileRoute("/women")({
  loader: () => listCatalog({ data: { category: "women" } }),
  head: () => ({ meta: [{ title: "عبايات النساء | حور" }] }),
  component: WomenPage,
});

function WomenPage() {
  const items = Route.useLoaderData();
  return (
    <CatalogPage
      kicker="مجموعة النساء"
      title="عبايات النساء"
      intro="تصاميم تُصنع للمرأة، والمقاس الذي تختارينه يُظهر فقط ما هو متوفر في المخزون."
      items={items}
    />
  );
}
