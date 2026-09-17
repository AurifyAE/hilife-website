"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PhotoLightbox } from "@/components/portfolio/photo-lightbox";
import { PhotoTile } from "@/components/portfolio/photo-tile";
import { eventTypes } from "@/data/events";
import { photosForEvent, portfolioPhotos } from "@/data/portfolio";
import { cx } from "@/lib/cx";

const SEARCH_CHANGE = "hilife:portfolio-search-change";

function subscribeToSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(SEARCH_CHANGE, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(SEARCH_CHANGE, callback);
  };
}

/** Event types that have photos, with their counts */
const filters = eventTypes
  .map((event) => ({ event, count: photosForEvent(event.slug).length }))
  .filter((filter) => filter.count > 0);

/**
 * The full photo gallery, filterable by event type. The filter lives in the URL (?event=slug) so
 * event pages can link straight to their photos.
 */
export function PortfolioBrowser() {
  const search = useSyncExternalStore(subscribeToSearch, () => window.location.search, () => "");
  const activeSlug = new URLSearchParams(search).get("event");
  const active = filters.find((filter) => filter.event.slug === activeSlug)?.event ?? null;
  const photos = active ? photosForEvent(active.slug) : portfolioPhotos;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const select = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) params.set("event", slug);
    else params.delete("event");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    window.dispatchEvent(new Event(SEARCH_CHANGE));
  };

  // The page got taller or shorter: re-measure scroll animations further down
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [photos.length]);

  const chip = (label: string, count: number, slug: string | null) => {
    const pressed = (active?.slug ?? null) === slug;
    return (
      <button
        key={slug ?? "all"}
        type="button"
        aria-pressed={pressed}
        onClick={() => select(slug)}
        className={cx(
          "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-small transition-colors",
          pressed
            ? "border-forest-900 bg-forest-900 text-cream-50"
            : "border-forest-900/15 bg-white text-forest-900 hover:border-forest-900/40",
        )}
      >
        {label}
        <span className={cx("tabular-nums", pressed ? "text-cream-50/70" : "text-stone/70")}>{count}</span>
      </button>
    );
  };

  return (
    <>
      <div role="group" aria-label="Filter photos by event type" className="flex flex-wrap gap-2">
        {chip("All", portfolioPhotos.length, null)}
        {filters.map(({ event, count }) => chip(event.name, count, event.slug))}
      </div>
      <p aria-live="polite" className="mt-5 text-small text-stone">
        {photos.length} {photos.length === 1 ? "photo" : "photos"}
        {active && ` from ${active.name.toLowerCase()}`}
      </p>

      <div className="mt-8 columns-2 gap-2 sm:gap-3 lg:columns-3">
        {photos.map((photo, index) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            sizes="(min-width: 1344px) 27rem, (min-width: 1024px) 32vw, 50vw"
            onOpen={() => setOpenIndex(index)}
            className="mb-2 break-inside-avoid sm:mb-3"
          />
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
