import { collections } from "@/data/collections";
import { productPhotos, type ProductPhotoSet } from "@/data/product-photos";
import productData from "@/data/products.json";
import type { CardPhoto, CatalogueProduct, Product } from "@/lib/product-display";

// The product sheet and photo map: server components only. Client components take what they need
// as props and import the pure helpers from product-display instead.
export * from "@/lib/product-display";

export const products = productData as Product[];

export const collectionCounts = products.reduce<Record<string, number>>((counts, product) => {
  counts[product.collection] = (counts[product.collection] ?? 0) + 1;
  return counts;
}, {});

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsIn(collectionSlug: string) {
  return products.filter((product) => product.collection === collectionSlug);
}

export function getProduct(collectionSlug: string, productSlug: string) {
  return products.find((product) => product.collection === collectionSlug && product.slug === productSlug);
}

export function productPhotoSet(product: Product): ProductPhotoSet | undefined {
  return productPhotos[product.code];
}

export function cardPhoto(product: Product): CardPhoto | null {
  const photos = productPhotos[product.code];
  return photos ? { src: photos.card.src, cutout: photos.cardCutout } : null;
}

export function withCardPhoto(product: Product): CatalogueProduct {
  return { ...product, card: cardPhoto(product) };
}
