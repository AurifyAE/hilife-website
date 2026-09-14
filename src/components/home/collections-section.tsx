"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { NotchCard } from "@/components/ui/notch-card";
import { collections } from "@/data/collections";
import { cx } from "@/lib/cx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tile = {
  /** Grid area name; the areas per breakpoint live in the bento-collections utility */
  area: string;
  size: "lg" | "md" | "sm";
  sizes: string;
};

const quarter = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const half = "(min-width: 768px) 50vw, 100vw";

const tiles: Record<string, Tile> = {
  sofas: { area: "sofas", size: "lg", sizes: half },
  chairs: { area: "chairs", size: "md", sizes: quarter },
  "arm-chairs": { area: "arm", size: "sm", sizes: quarter },
  "bar-stools": { area: "bar", size: "sm", sizes: quarter },
  tables: { area: "tables", size: "md", sizes: quarter },
  "furniture-sets": { area: "sets", size: "md", sizes: half },
  "office-chairs": { area: "office", size: "sm", sizes: quarter },
  pouffes: { area: "pouffes", size: "sm", sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 66vw, 50vw" },
  "accessories-appliances": { area: "acc", size: "md", sizes: "(min-width: 1024px) 50vw, 100vw" },
};

const titleSize = { lg: "text-h3", md: "text-h4", sm: "text-h5" };

// Reading order of the desktop grid, so numbering, tab order and the reveal stagger follow the screen
const displayOrder = [
  "sofas",
  "chairs",
  "arm-chairs",
  "bar-stools",
  "tables",
  "furniture-sets",
  "office-chairs",
  "pouffes",
  "accessories-appliances",
];
const orderedCollections = displayOrder.flatMap((slug) => collections.filter((c) => c.slug === slug));

export function CollectionsSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const tileEls = gsap.utils.toArray<HTMLElement>("[data-bento-tile]");
        const mediaEls = gsap.utils.toArray<HTMLElement>("[data-bento-media]");

        // Reveal: tiles wipe up one after another while their photos settle from a zoom
        gsap
          .timeline({ scrollTrigger: { trigger: gridRef.current, start: "top 75%", once: true } })
          .fromTo(
            tileEls,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              stagger: 0.07,
              ease: "power4.inOut",
              clearProps: "clipPath",
            },
            0,
          )
          .fromTo(mediaEls, { scale: 1.25 }, { scale: 1, duration: 1.6, stagger: 0.07, ease: "power3.out" }, 0.1);

        // Parallax: each photo drifts inside its tile (the photo is 20% taller than the tile)
        mediaEls.forEach((media) => {
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: gridRef },
  );

  return (
    <section id="collections" className="section-y scroll-mt-24 bg-cream-50">
      <div className="container-site">
        <div ref={gridRef} className="bento-collections gap-2 sm:gap-3">
          <div
            data-bento-tile
            style={{ gridArea: "intro" }}
            className="flex flex-col justify-between gap-8 rounded-[1.25rem] bg-forest-900 p-6 text-cream-50 sm:p-8 lg:rounded-[1.5rem] lg:p-10"
          >
            <div>
              <p className="eyebrow text-copper-300">Our Collections</p>
              <h2 className="mt-4 text-h2 text-cream-50">Nine collections for every kind of event</h2>
              <p className="mt-4 max-w-md text-cream-50/70">
                From banquet chairs to outdoor lounges and appliances, pick the pieces you need and
                send one enquiry for all of them.
              </p>
            </div>
            <ButtonLink href="/furniture" variant="copper" size="md" className="self-start">
              View all furniture
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          </div>

          {orderedCollections.map((collection, index) => {
            const tile = tiles[collection.slug];
            return (
              <div key={collection.slug} data-bento-tile style={{ gridArea: tile.area }} className="min-h-0">
                <NotchCard
                  href={`/furniture/${collection.slug}`}
                  className="bento-tile h-full"
                  cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.5rem]"
                  actionClassName="bg-forest-900 text-cream-50 group-hover:bg-copper-500"
                  notch={{
                    size: "clamp(2.75rem, 2rem + 2vw, 3.75rem)",
                    corner: "clamp(0.75rem, 0.5rem + 0.6vw, 1.125rem)",
                  }}
                >
                  <div data-bento-media className="absolute inset-x-0 -inset-y-[10%] -z-20 will-change-transform">
                    <Image
                      src={collection.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes={tile.sizes}
                      style={{ objectPosition: collection.focus }}
                      className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-t from-forest-950/85 via-forest-950/20 to-transparent"
                  />
                  {/* Right padding keeps the text clear of the notch */}
                  <div className="absolute inset-x-0 bottom-0 pr-[calc(var(--notch-size)+1rem)] pb-4 pl-4 sm:pr-[calc(var(--notch-size)+1.5rem)] sm:pb-5 sm:pl-5 lg:pb-6 lg:pl-6">
                    <span className="text-small font-medium text-copper-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={cx("mt-1 text-cream-50", titleSize[tile.size])}>{collection.name}</h3>
                    {/* Shown on touch screens; slides open on hover where hovering exists */}
                    <div className={cx("bento-desc", tile.size === "sm" && "max-sm:hidden")}>
                      <div>
                        <p className="max-w-xs pt-2 text-small text-cream-50/75">{collection.description}</p>
                      </div>
                    </div>
                  </div>
                </NotchCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
