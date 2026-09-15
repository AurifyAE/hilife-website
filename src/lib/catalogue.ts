import { collections } from "@/data/collections";
import { productPhotos, type ProductPhotoSet } from "@/data/product-photos";
import productData from "@/data/products.json";

/** One row of the product shoot sheet, cleaned up by the import script */
export type Product = {
  /** Shoot image number, e.g. "H001" */
  id: string;
  code: string;
  slug: string;
  name: string;
  /** Collection slug from src/data/collections.ts */
  collection: string;
  colour: string | null;
  /** Measurements separated by " · " */
  dimensions: string;
  description: string;
  /** "Edited image name" number from the sheet, when the photo has been edited */
  photo: number | null;
  sourceCategory: string | null;
};

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

export function productHref(product: Product) {
  return `/furniture/${product.collection}/${product.slug}`;
}

export function productPhotoSet(product: Product): ProductPhotoSet | undefined {
  return productPhotos[product.code];
}

export function dimensionParts(product: Product) {
  return product.dimensions.split(" · ").filter(Boolean);
}

/** The sheet has no indoor/outdoor column, so outdoor pieces are recognised by name */
export function isOutdoor(product: Product) {
  return /outdoor|rattan|garden|patio|umbrella|rope woven/i.test(product.name);
}

const swatches: Record<string, string> = {
  Black: "#1f1f1f",
  White: "#ffffff",
  "Off White": "#f3efe6",
  Ivory: "#f2ecdc",
  Cream: "#efe4cf",
  Beige: "#d8c4a3",
  Tan: "#b07a4b",
  Brown: "#6b4a33",
  Wood: "#8a5a36",
  Natural: "#c9a270",
  "Natural Cane": "#c9a46b",
  Orange: "#d0752f",
  Red: "#b3312c",
  Green: "#2f6b4f",
  Blue: "#2c4f8a",
  Grey: "#9a9a9a",
  Silver: "#c7c9cc",
  Steel: "#b3b8bc",
  Glass: "linear-gradient(135deg, #eef6f7, #b9d0d6)",
};

export function colourSwatch(colour: string) {
  return swatches[colour] ?? "#cccccc";
}
