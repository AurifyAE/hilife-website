import type { Metadata } from "next";
import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { QuoteRequest } from "@/components/quote/quote-request";
import { eventTypes } from "@/data/events";
import { getCollection, productHref, productPhotoSet, products } from "@/lib/catalogue";
import type { QuoteProduct } from "@/lib/quote";

export const metadata: Metadata = {
  alternates: { canonical: "/quote" },
  title: "Request a Quote",
  description:
    "Send your furniture list and event details, and the Hi-Life team will reply with availability and a quote for your dates anywhere in the UAE.",
};

export default function QuotePage() {
  // Only what the summary shows, so the full photo map stays out of the browser bundle
  const catalogue: QuoteProduct[] = products.map((product) => {
    const photos = productPhotoSet(product);
    return {
      code: product.code,
      name: product.name,
      href: productHref(product),
      collection: getCollection(product.collection)?.name ?? "",
      image: photos?.card.src ?? null,
      cutout: photos?.cardCutout ?? false,
    };
  });

  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Request a Quote" }]}
        eyebrow="Request a quote"
        title="Tell us about your event"
        description="Review your pieces, add your event details and send it over. Our team checks availability and replies with a quote for your dates."
      />
      <QuoteRequest catalogue={catalogue} events={eventTypes.map(({ slug, name }) => ({ slug, name }))} />
    </>
  );
}
