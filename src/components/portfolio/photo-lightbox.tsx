"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, CloseIcon } from "@/components/icons";
import { eventTypes } from "@/data/events";
import type { PortfolioPhoto } from "@/data/portfolio";
import { getLenis } from "@/lib/lenis";

type Props = {
  photos: PortfolioPhoto[];
  /** Index of the photo on show, or null when closed */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Full-screen photo viewer on a native modal <dialog>, which traps focus, closes on Escape and
 * returns focus to the photo that opened it. Arrow keys and swipes move between photos.
 */
export function PhotoLightbox({ photos, index, onIndexChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;
  const photo = index !== null ? photos[index] : undefined;
  const event = photo && eventTypes.find((item) => item.slug === photo.event);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const step = (direction: 1 | -1) => {
    if (index === null) return;
    onIndexChange((index + direction + photos.length) % photos.length);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onClose={() => {
        getLenis()?.start();
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "ArrowRight") step(1);
        if (keyEvent.key === "ArrowLeft") step(-1);
        // The dialog closes on Escape by itself too; closing here as well keeps it reliable
        if (keyEvent.key === "Escape") {
          keyEvent.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onTouchStart={(touchEvent) => {
        touchStartX.current = touchEvent.touches[0].clientX;
      }}
      onTouchEnd={(touchEvent) => {
        if (touchStartX.current === null) return;
        const distance = touchEvent.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-forest-950/95 p-0 text-cream-50 backdrop-blur-sm backdrop:bg-transparent open:flex open:flex-col"
    >
      {photo && index !== null && (
        <>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            <p aria-live="polite" className="text-small text-cream-50/70 tabular-nums">
              {index + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close photo viewer"
              className="grid size-11 cursor-pointer place-items-center rounded-full bg-cream-50/10 transition-colors hover:bg-cream-50/20"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Clicking the empty space around the photo closes the viewer */}
          <div
            className="relative min-h-0 flex-1"
            onClick={(clickEvent) => {
              if (clickEvent.target === clickEvent.currentTarget) dialogRef.current?.close();
            }}
          >
            <Image
              key={photo.id}
              src={photo.image}
              alt={photo.alt}
              fill
              sizes="100vw"
              placeholder="blur"
              className="pointer-events-none object-contain px-4 motion-safe:animate-[fade-in_350ms_ease-out] sm:px-24"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-cream-50/10 transition-colors hover:bg-cream-50/25 sm:grid"
                >
                  <ArrowRightIcon className="size-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-cream-50/10 transition-colors hover:bg-cream-50/25 sm:grid"
                >
                  <ArrowRightIcon className="size-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-small text-cream-50/80">{photo.alt}</p>
            {event && (
              <Link
                href={`/events/${event.slug}`}
                onClick={() => dialogRef.current?.close()}
                className="group inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-4 py-2 text-small font-semibold transition-colors hover:border-copper-300 hover:text-copper-300"
              >
                {event.name}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
