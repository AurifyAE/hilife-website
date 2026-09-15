import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { collectionCounts, products } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Furniture catalogue",
  description:
    "Browse rental chairs, sofas, tables, bar stools, pouffes and more for events and exhibitions across the UAE.",
};

export default function FurniturePage() {
  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Furniture" }]}
        eyebrow="Rental catalogue"
        title="All furniture"
        description="Filter by collection, colour or setting, add the pieces you need to your enquiry, and we'll come back with availability and a quote."
      />
      <div className="pb-24 lg:pb-32">
        <CatalogueBrowser
          products={products}
          activeCollection={null}
          collectionCounts={collectionCounts}
          total={products.length}
        />
      </div>
    </>
  );
}
