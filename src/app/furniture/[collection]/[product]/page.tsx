import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/catalogue/catalogue-header";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductEnquiryActions } from "@/components/catalogue/product-enquiry-actions";
import { ProductGallery } from "@/components/catalogue/product-gallery";
import { ProductPhoto } from "@/components/catalogue/product-photo";
import { ArrowRightIcon } from "@/components/icons";
import {
  colourSwatch,
  dimensionParts,
  getCollection,
  getProduct,
  getProductsIn,
  productPhotoSet,
  products,
} from "@/lib/catalogue";

// Static export: every product page is generated at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ collection: product.collection, product: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/furniture/[collection]/[product]">): Promise<Metadata> {
  const { collection, product: slug } = await params;
  const product = getProduct(collection, slug);
  if (!product) return {};
  return {
    title: `${product.name} (${product.code})`,
    description: product.description || `${product.name}, available to rent for events across the UAE.`,
  };
}

export default async function ProductPage({ params }: PageProps<"/furniture/[collection]/[product]">) {
  const { collection: collectionSlug, product: slug } = await params;
  const product = getProduct(collectionSlug, slug);
  const collection = getCollection(collectionSlug);
  if (!product || !collection) notFound();

  const photos = productPhotoSet(product);
  const related = getProductsIn(collection.slug)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <div className="container-site pt-28 lg:pt-36">
        <Breadcrumbs
          items={[
            { label: "Furniture", href: "/furniture" },
            { label: collection.name, href: `/furniture/${collection.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {photos ? (
              <ProductGallery name={product.name} images={photos.images} />
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-studio">
                <ProductPhoto product={product} sizes="(min-width: 1024px) 55vw, 100vw" preload />
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-copper-600">{product.code}</p>
              <h1 className="mt-4 text-h2 text-forest-900">{product.name}</h1>
              {product.description && <p className="mt-6 text-lead text-stone">{product.description}</p>}

              <dl className="mt-8 divide-y divide-forest-900/10 border-y border-forest-900/10">
                <DetailRow label="Reference code">{product.code}</DetailRow>
                <DetailRow label="Collection">
                  <Link
                    href={`/furniture/${collection.slug}`}
                    className="text-forest-900 underline decoration-forest-900/30 underline-offset-4 hover:decoration-forest-900"
                  >
                    {collection.name}
                  </Link>
                </DetailRow>
                {product.colour && (
                  <DetailRow label="Colour">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-3.5 rounded-full border border-forest-900/15"
                        style={{ background: colourSwatch(product.colour) }}
                      />
                      {product.colour}
                    </span>
                  </DetailRow>
                )}
                <DetailRow label="Dimensions">
                  <ul className="space-y-1">
                    {dimensionParts(product).map((part) => (
                      <li key={part} className="first-letter:uppercase">
                        {part}
                      </li>
                    ))}
                  </ul>
                </DetailRow>
              </dl>

              <div className="mt-8">
                <ProductEnquiryActions code={product.code} name={product.name} />
              </div>

              <ul className="mt-8 space-y-2 rounded-[1.25rem] bg-cream-100 p-5 text-small text-stone">
                <li>Prices on request, quoted for your dates and venue</li>
                <li>Delivery and collection across the UAE</li>
                <li>Availability confirmed by our team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="section-y">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-heading" className="text-h3 text-forest-900">
                More {collection.name.toLowerCase()}
              </h2>
              <Link
                href={`/furniture/${collection.slug}`}
                className="group inline-flex items-center gap-2 text-small font-semibold text-forest-900"
              >
                View all {collection.name.toLowerCase()}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3.5 text-small">
      <dt className="text-stone">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
