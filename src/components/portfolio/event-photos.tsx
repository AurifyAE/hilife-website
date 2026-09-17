"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { PhotoLightbox } from "@/components/portfolio/photo-lightbox";
import { PhotoTile } from "@/components/portfolio/photo-tile";
import { photosForEvent } from "@/data/portfolio";
import { cx } from "@/lib/cx";

/** Portfolio photos tagged with this event type: three equal tiles, all photos in the viewer */
export function EventPhotos({ eventSlug }: { eventSlug: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = photosForEvent(eventSlug);
  if (photos.length === 0) return null;

  return (
    <section aria-labelledby="event-photos-heading" className="container-site section-y">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-600">From our portfolio</p>
          <h2 id="event-photos-heading" className="mt-4 text-h2 text-forest-900">
            Spaces we&apos;ve set up
          </h2>
        </div>
        <Link
          href={`/portfolio?event=${eventSlug}`}
          className="group inline-flex items-center gap-3 self-start text-small font-semibold tracking-wide whitespace-nowrap text-forest-900 md:self-auto"
        >
          See all {photos.length} {photos.length === 1 ? "photo" : "photos"}
          <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
            <ArrowRightIcon className="size-4" />
          </span>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {photos.slice(0, 3).map((photo, index) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            aspect="4 / 3"
            sizes="(min-width: 768px) 30vw, 50vw"
            onOpen={() => setOpenIndex(index)}
            // Two across on phones: the third photo waits for the wider grid
            className={cx(index === 2 && "hidden md:block")}
          />
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
