"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/product-photos";
import { cx } from "@/lib/cx";

export function ProductGallery({ name, images }: { name: string; images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-studio">
        <Image
          key={active}
          src={current.src}
          alt={images.length > 1 ? `${name}, photo ${active + 1} of ${images.length}` : name}
          fill
          preload={active === 0}
          // A blurred preview of a transparent cut-out reads as a dark smudge; only studio shots get one
          placeholder={current.cutout ? "empty" : "blur"}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className={cx(
            "animate-[fade-in_400ms_ease-out]",
            current.cutout ? "object-contain p-[8%]" : "object-cover",
          )}
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label={`${name} photos`}>
          {images.map((image, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${images.length}`}
                aria-pressed={index === active}
                className={cx(
                  "relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-studio transition-shadow",
                  index === active
                    ? "ring-2 ring-forest-900 ring-offset-2 ring-offset-cream-50"
                    : "opacity-80 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 25vw"
                  className={image.cutout ? "object-contain p-[10%]" : "object-cover"}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
