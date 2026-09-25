import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { collections } from "@/data/collections";
import { collectionCounts, getCollection, getProductsIn, products, withCardPhoto } from "@/lib/catalogue";

// Static export: only the nine collections exist
export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({ params }: PageProps<"/furniture/[collection]">): Promise<Metadata> {
  const collection = getCollection((await params).collection);
  if (!collection) return {};
  return {
    title: `${collection.name} for rent`,
    description: collection.description,
    alternates: { canonical: `/furniture/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps<"/furniture/[collection]">) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Furniture", href: "/furniture" }, { label: collection.name }]}
        eyebrow="Collection"
        title={collection.name}
        description={collection.description}
        image={collection.image}
        focus={collection.focus}
      />
      <div className="pb-24 lg:pb-32">
        <CatalogueBrowser
          products={getProductsIn(slug).map(withCardPhoto)}
          activeCollection={slug}
          collectionCounts={collectionCounts}
          total={products.length}
        />
      </div>
    </>
  );
}
