"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ParallaxGallery } from "@/components/portfolio/parallax-gallery";
import { PhotoLightbox } from "@/components/portfolio/photo-lightbox";
import { portfolioPhotos } from "@/data/portfolio";

/** Homepage shows the newest nine: three full columns on desktop */
const HOMEPAGE_PHOTOS = portfolioPhotos.slice(0, 9);

export function PortfolioSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="section-y bg-cream-50">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-copper-600">Portfolio</p>
            <h2 id="portfolio-heading" className="mt-4 text-h2 text-forest-900">
              Spaces we&apos;ve set up
            </h2>
            <p className="mt-5 text-lead text-stone">
              A look at how our furniture comes together at real venues, from conference halls to garden
              receptions.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 self-start text-small font-semibold tracking-wide text-forest-900 md:self-auto"
          >
            View all photos
            <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
              <ArrowRightIcon className="size-4" />
            </span>
          </Link>
        </div>

        <div className="mt-12 lg:mt-16">
          <ParallaxGallery photos={HOMEPAGE_PHOTOS} onOpen={setOpenIndex} />
        </div>
      </div>

      <PhotoLightbox
        photos={HOMEPAGE_PHOTOS}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
