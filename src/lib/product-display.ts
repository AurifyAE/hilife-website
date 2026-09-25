/**
 * Product types and pure helpers, with no data imports. Catalogue listings run in the browser, so
 * anything they import must not drag the 185-product sheet or the photo map into the page bundle;
 * the data itself lives in catalogue.ts, which only server components use.
 */

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

/** Just enough of a card photo to render it, passed from the server into catalogue listings */
export type CardPhoto = { src: string; cutout: boolean };

/** A product plus its card photo ("photo" is already the sheet's edited-image number) */
export type CatalogueProduct = Product & { card: CardPhoto | null };

export function productHref(product: Product) {
  return `/furniture/${product.collection}/${product.slug}`;
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
