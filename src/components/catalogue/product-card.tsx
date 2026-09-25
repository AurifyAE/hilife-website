import Link from "next/link";
import { AddToEnquiryButton } from "@/components/catalogue/add-to-enquiry-button";
import { ProductPhoto } from "@/components/catalogue/product-photo";
import { colourSwatch, dimensionParts, productHref, type CatalogueProduct } from "@/lib/product-display";

export function ProductCard({ product }: { product: CatalogueProduct }) {
  const href = productHref(product);

  return (
    <article className="group flex h-full flex-col">
      {/* The title link is the accessible one; the photo link is a larger mouse target */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-studio"
      >
        <ProductPhoto
          photo={product.card}
          name={product.name}
          code={product.code}
          sizes="(min-width: 1536px) 20vw, (min-width: 640px) 26vw, 45vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <p className="text-[0.75rem] font-medium tracking-wide text-copper-600">{product.code}</p>
        <h3 className="mt-1 text-h6 text-forest-900">
          <Link href={href} className="decoration-copper-500 underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-small text-stone">{dimensionParts(product).slice(0, 3).join(" · ")}</p>
        {product.colour && (
          <p className="mt-2 inline-flex items-center gap-2 text-small text-stone">
            <span
              aria-hidden
              className="size-3 rounded-full border border-forest-900/15"
              style={{ background: colourSwatch(product.colour) }}
            />
            {product.colour}
          </p>
        )}
        <div className="mt-auto pt-4">
          <AddToEnquiryButton code={product.code} name={product.name} />
        </div>
      </div>
    </article>
  );
}
