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
import { eventTypes } from "@/data/events";
import { quoteHref } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const collectionName = (slug: string) => collections.find((collection) => collection.slug === slug)?.name ?? slug;

export function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // Desktop only: the section pins and vertical scrolling moves the cards sideways.
      // Phones, tablets and reduced motion keep a native swipe/scroll row.
      media.add(
        { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
          const section = sectionRef.current;
          const viewport = viewportRef.current;
          const track = trackRef.current;
          if (!desktop || !section || !viewport || !track) return;

          if (reduce) {
            gsap.set(viewport, { overflowX: "auto" });
            return;
          }

          const cards = gsap.utils.toArray<HTMLElement>("[data-event-card]", track);
          // clientWidth includes the viewport's left padding, so add it back to reach the true end
          const distance = () =>
            Math.max(0, track.scrollWidth + parseFloat(getComputedStyle(viewport).paddingLeft) - viewport.clientWidth);
          // After the last card arrives, stay pinned a little longer before the page moves on
          const HOLD = 0.25;

          const slide = gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance() * (1 + HOLD)}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                // The line is full when the last card arrives, not at the end of the hold
                onUpdate: ({ progress }) =>
                  gsap.set(barRef.current, { scaleX: Math.min(1, progress * (1 + HOLD)) }),
              },
            })
            .to(track, { x: () => -distance(), duration: 1 })
            .to({}, { duration: HOLD });

          // Each photo drifts inside its card as the card travels across the screen
          cards.forEach((card) => {
            gsap.fromTo(
              card.querySelector("[data-event-media]"),
              { xPercent: -8 },
              {
                xPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: slide,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="events"
      aria-labelledby="events-heading"
      className="relative overflow-hidden bg-forest-950 text-cream-50"
    >
      <div className="section-y lg:flex lg:h-svh lg:items-center lg:py-0">
        {/* Intro: above the row on small screens, fixed on the left while cards slide on desktop */}
        <div className="px-gutter lg:w-[clamp(21rem,32vw,30rem)] lg:shrink-0 lg:pr-0 lg:pl-edge">
          <p className="eyebrow text-copper-300">Events we furnish</p>
          <h2 id="events-heading" className="mt-4 text-h2 text-cream-50">
            From boardrooms to ballrooms
          </h2>
          <p className="mt-5 max-w-md text-lead text-cream-50/70">
            Tell us the event, the venue and the date. We bring the furniture and deliver it across
            the UAE.
          </p>

          {/* Progress line for the sideways scroll (desktop only) */}
          <span aria-hidden className="relative mt-10 hidden h-px overflow-hidden bg-cream-50/15 lg:block">
            {/* Start width set inline: Tailwind's scale-x-0 uses the CSS scale property, which GSAP's transform can't undo */}
            <span
              ref={barRef}
              className="absolute inset-0 origin-left bg-copper-400"
              style={{ transform: "scaleX(0)" }}
            />
          </span>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <ButtonLink href={quoteHref} variant="copper" size="md">
              Plan your event
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
            <span className="text-small text-cream-50/50 lg:hidden">Swipe to explore →</span>
          </div>
        </div>

        {/* On desktop the left edge fades, so cards dissolve as they slide past the intro */}
        <div
          ref={viewportRef}
          className="mt-10 lg:mt-0 lg:min-w-0 lg:flex-1 lg:overflow-hidden lg:pl-12 lg:[mask-image:linear-gradient(to_right,transparent,black_5rem)]"
        >
          <ul
            ref={trackRef}
            className="flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto pr-gutter pb-2 pl-gutter [scrollbar-width:none] sm:gap-4 lg:w-max lg:snap-none lg:gap-5 lg:overflow-visible lg:pr-[max(5rem,calc(var(--spacing-gutter)*2))] lg:pl-0 [&::-webkit-scrollbar]:hidden"
          >
            {eventTypes.map((event, index) => {
              // Cards alternate: photo on top then text, text on top then photo, so the text zig-zags
              const photoFirst = index % 2 === 0;

              const photo = (
                <NotchCard
                  href={`/events/${event.slug}`}
                  label={event.name}
                  className="aspect-[4/5] shrink-0 lg:aspect-auto lg:min-h-0 lg:flex-1"
                  cardClassName="rounded-[1.25rem] border border-cream-50/15 p-2 transition-colors duration-500 group-hover:border-copper-300/50 lg:rounded-[1.5rem]"
                  actionClassName="bg-copper-500 text-white group-hover:bg-cream-50 group-hover:text-forest-900"
                  notch={{ size: "3.5rem" }}
                >
                  <div className="relative h-full overflow-hidden rounded-[0.875rem] lg:rounded-[1.125rem]">
                    <div data-event-media className="absolute inset-y-0 -inset-x-[12%] will-change-transform">
                      <Image
                        src={event.image}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 22vw, 78vw"
                        style={{ objectPosition: event.focus }}
                        className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </NotchCard>
              );

              // Same minimum height on every card so the photos and text bands line up
              const text = (
                <div className="px-1 lg:min-h-[13rem]">
                  <span className="text-small font-medium text-copper-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-h4 text-cream-50">{event.name}</h3>
                  <p className="mt-2 text-small text-cream-50/65">{event.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Suggested for ${event.name}`}>
                    {event.collections.map((slug) => (
                      <li
                        key={slug}
                        className="rounded-full border border-cream-50/20 px-2.5 py-0.5 text-[0.75rem] text-cream-50/80"
                      >
                        {collectionName(slug)}
                      </li>
                    ))}
                  </ul>
                </div>
              );

              return (
                <li
                  key={event.slug}
                  data-event-card
                  className="flex w-[78vw] max-w-[22rem] shrink-0 snap-start flex-col gap-5 lg:h-[min(38rem,calc(100svh-9rem))] lg:w-[clamp(17rem,22vw,23rem)] lg:max-w-none"
                >
                  {photoFirst ? (
                    <>
                      {photo}
                      {text}
                    </>
                  ) : (
                    <>
                      {text}
                      {photo}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
