"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { PhotoTile } from "@/components/portfolio/photo-tile";
import type { PortfolioPhoto } from "@/data/portfolio";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Deals photos into columns in turn, so neighbouring photos end up side by side */
function toColumns(photos: PortfolioPhoto[], count: number) {
  const columns: { photo: PortfolioPhoto; index: number }[][] = Array.from({ length: count }, () => []);
  photos.forEach((photo, index) => columns[index % count].push({ photo, index }));
  return columns;
}

/**
 * Photo columns inside a fixed-height window. While the window crosses the screen the outer columns
 * slide up and the middle one slides down, each by exactly its overflow, so every photo passes
 * through view and no column runs out. Three columns from md, two below. With reduced motion the
 * window has no fixed height and simply shows every photo.
 */
export function ParallaxGallery({
  photos,
  onOpen,
}: {
  photos: PortfolioPhoto[];
  onOpen: (index: number) => void;
}) {
  const windowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add({ wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
        const { wide, motion } = context.conditions as { wide: boolean; motion: boolean };
        const frame = windowRef.current;
        if (!motion || !frame) return;

        const layout = frame.querySelector(wide ? "[data-layout='wide']" : "[data-layout='narrow']");
        gsap.utils.toArray<HTMLElement>("[data-column]", layout).forEach((column, index) => {
          const travel = () => Math.max(0, column.offsetHeight - frame.clientHeight);
          const down = index % 2 === 1;
          gsap.fromTo(
            column,
            { y: () => (down ? -travel() : 0) },
            {
              y: () => (down ? 0 : -travel()),
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    },
    { scope: windowRef },
  );

  const layouts = [
    { name: "wide", count: 3, className: "hidden md:flex", sizes: "(min-width: 1344px) 27rem, 32vw" },
    { name: "narrow", count: 2, className: "flex md:hidden", sizes: "50vw" },
  ];

  return (
    <div
      ref={windowRef}
      className="relative motion-safe:h-[clamp(30rem,78svh,52rem)] motion-safe:overflow-hidden motion-safe:[mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_calc(100%-3rem),transparent)]"
    >
      {layouts.map((layout) => (
        <div key={layout.name} data-layout={layout.name} className={`${layout.className} items-start gap-2 sm:gap-3`}>
          {toColumns(photos, layout.count).map((column, columnIndex) => (
            <div key={columnIndex} data-column className="flex min-w-0 flex-1 flex-col gap-2 will-change-transform sm:gap-3">
              {column.map(({ photo, index }) => (
                <PhotoTile key={photo.id} photo={photo} sizes={layout.sizes} onOpen={() => onOpen(index)} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
