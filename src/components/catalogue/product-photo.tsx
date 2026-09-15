import Image from "next/image";
import { productPhotoSet, type Product } from "@/lib/catalogue";
import { cx } from "@/lib/cx";

/** Fills its positioned parent (on the studio colour) with the card photo, or a placeholder */
export function ProductPhoto({
  product,
  sizes,
  preload = false,
  className,
}: {
  product: Product;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const photos = productPhotoSet(product);

  if (photos) {
    return (
      <Image
        src={photos.card}
        alt={product.name}
        fill
        sizes={sizes}
        preload={preload}
        placeholder={photos.cardCutout ? "empty" : "blur"}
        className={cx(photos.cardCutout ? "object-contain p-[12%]" : "object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${product.name}, photo coming soon`}
      className={cx("absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center", className)}
    >
      <span className="text-[clamp(0.75rem,0.55rem+0.8vw,1.375rem)] font-semibold tracking-wide whitespace-nowrap text-forest-900/15">
        {product.code}
      </span>
      <span className="text-[0.625rem] font-medium tracking-[0.2em] text-stone/60 uppercase">Photo coming soon</span>
    </div>
  );
}
