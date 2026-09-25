import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { eventTypes } from "@/data/events";
import { productHref, products } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

// Written out as a file at build time (the site is a static export)
export const dynamic = "force-static";

/** Every page search engines should index. The thank-you page is left out on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified: updated,
    changeFrequency: "monthly",
    priority,
  });

  return [
    entry("/", 1),
    entry("/furniture", 0.9),
    entry("/events", 0.8),
    entry("/portfolio", 0.7),
    entry("/quote", 0.7),
    entry("/contact", 0.7),
    entry("/about", 0.6),
    entry("/privacy", 0.2),
    entry("/terms", 0.2),
    ...collections.map((collection) => entry(`/furniture/${collection.slug}`, 0.8)),
    ...eventTypes.map((event) => entry(`/events/${event.slug}`, 0.7)),
    ...products.map((product) => entry(productHref(product), 0.6)),
  ];
}
