import Image from "next/image";
import Link from "next/link";
import { NotchCard } from "@/components/ui/notch-card";
import { collections } from "@/data/collections";
import type { EventType } from "@/data/events";
import { cx } from "@/lib/cx";

/** Photo card for one event type: notched photo, then number, name, description and suitable collections */
export function EventCard({
  event,
  index,
  className,
  photoClassName,
}: {
  event: EventType;
  index: number;
  /** Grid placement */
  className?: string;
  /** Aspect ratio overrides for wide cards */
  photoClassName?: string;
}) {
  const href = `/events/${event.slug}`;

  return (
    <article className={cx("flex flex-col gap-5", className)}>
      <NotchCard
        href={href}
        label={event.name}
        className={cx("aspect-[4/3]", photoClassName)}
        cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.5rem]"
        actionClassName="bg-copper-500 text-white group-hover:bg-forest-900"
        notch={{ size: "3.5rem" }}
      >
        <Image
          src={event.image}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
          style={{ objectPosition: event.focus }}
          className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
        />
      </NotchCard>

      <div className="px-1">
        <span className="text-small font-medium text-copper-600 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="mt-1 text-h4 text-forest-900">
          <Link href={href} className="decoration-copper-500 underline-offset-4 hover:underline">
            {event.name}
          </Link>
        </h2>
        <p className="mt-2 text-small text-stone">{event.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Furniture for ${event.name.toLowerCase()}`}>
          {event.collections.map((slug) => {
            const collection = collections.find((item) => item.slug === slug);
            if (!collection) return null;
            return (
              <li key={slug}>
                <Link
                  href={`/furniture/${slug}`}
                  className="inline-block rounded-full border border-forest-900/15 px-2.5 py-0.5 text-[0.75rem] text-forest-900/80 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
                >
                  {collection.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
