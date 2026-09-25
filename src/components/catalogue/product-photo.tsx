import Image from "next/image";
import type { CardPhoto } from "@/lib/product-display";
import { cx } from "@/lib/cx";

/**
 * Fills its positioned parent (on the studio colour) with the card photo, or a placeholder.
 * Cards show no blur preview: the tile already sits on the studio colour, and the previews for the
 * whole catalogue would be far larger than the photos they stand in for.
 */
export function ProductPhoto({
  photo,
  name,
  code,
  sizes,
  preload = false,
  className,
}: {
  photo: CardPhoto | null;
  name: string;
  code: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={name}
        fill
        sizes={sizes}
        preload={preload}
        className={cx(photo.cutout ? "object-contain p-[12%]" : "object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name}, photo coming soon`}
      className={cx("absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center", className)}
    >
      <span className="text-[clamp(0.75rem,0.55rem+0.8vw,1.375rem)] font-semibold tracking-wide whitespace-nowrap text-forest-900/15">
        {code}
      </span>
      <span className="text-[0.625rem] font-medium tracking-[0.2em] text-stone/60 uppercase">Photo coming soon</span>
    </div>
  );
}
