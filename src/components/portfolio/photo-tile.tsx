import Image from "next/image";
import { ExpandIcon } from "@/components/icons";
import { eventTypes } from "@/data/events";
import type { PortfolioPhoto } from "@/data/portfolio";
import { cx } from "@/lib/cx";

/** A gallery photo that opens the viewer; the event type slides up on hover */
export function PhotoTile({
  photo,
  onOpen,
  sizes,
  aspect,
  className,
}: {
  photo: PortfolioPhoto;
  onOpen: () => void;
  sizes: string;
  /** Overrides the photo's own crop, e.g. for a row of equal tiles */
  aspect?: string;
  className?: string;
}) {
  const eventName = eventTypes.find((event) => event.slug === photo.event)?.name;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View photo: ${photo.alt}`}
      style={{ aspectRatio: aspect ?? photo.aspect ?? `${photo.image.width} / ${photo.image.height}` }}
      className={cx(
        "group relative block w-full cursor-zoom-in overflow-hidden rounded-[1rem] bg-forest-900 lg:rounded-[1.25rem]",
        className,
      )}
    >
      <Image
        src={photo.image}
        alt=""
        fill
        placeholder="blur"
        sizes={sizes}
        style={{ objectPosition: photo.focus }}
        className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-forest-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span
        aria-hidden
        className="absolute top-3 right-3 grid size-9 translate-y-1 place-items-center rounded-full bg-cream-50/85 text-forest-900 opacity-0 backdrop-blur-sm transition-[opacity,translate] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <ExpandIcon className="size-4" />
      </span>
      {eventName && (
        <span
          aria-hidden
          className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-cream-50/90 px-3 py-1 text-[0.75rem] font-medium text-forest-900 opacity-0 transition-[opacity,translate] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {eventName}
        </span>
      )}
    </button>
  );
}
