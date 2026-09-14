"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { NotchCard } from "@/components/ui/notch-card";
import { heroSlides } from "@/data/hero-slides";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { quoteHref } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP);

const AUTOPLAY_SECONDS = 6;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = heroSlides.length;
  const upcoming = (current + 1) % count;
  const upcomingSlide = heroSlides[upcoming];

  useGSAP(
    () => {
      // Headlines of the waiting slides sit below their line masks
      heroSlides.forEach((_, index) => {
        if (index !== 0) gsap.set(lineRefs.current[index], { yPercent: 110 });
      });

      // Intro, timed to follow the header drop-in: photo settles, headline rises, then buttons and card
      const headline = slideRefs.current[0]?.querySelector("h2");
      const reveal = [buttonsRef.current, cardRef.current];
      if (headline) gsap.set(headline, { opacity: 1 });
      if (prefersReducedMotion()) {
        gsap.set(reveal, { opacity: 1 });
        return;
      }
      gsap
        .timeline()
        .from(mediaRefs.current[0], { scale: 1.08, duration: 2.4, ease: "power2.out" }, 0)
        .from(lineRefs.current[0], { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "power4.out" }, 0.45)
        .fromTo(
          reveal,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
          0.95,
        );
    },
    { scope: stageRef },
  );

  // Stop a running transition if the hero unmounts
  useEffect(() => () => void timelineRef.current?.kill(), []);

  // Runs from clicks, swipes and autoplay only, never during render
  function goTo(next: number) {
    if (timelineRef.current?.isActive() || next === current) return;

    const inSlide = slideRefs.current[next];
    const outSlide = slideRefs.current[current];
    const inMedia = mediaRefs.current[next];
    const outMedia = mediaRefs.current[current];
    const inLines = lineRefs.current[next];
    const outLines = lineRefs.current[current];
    const card = cardRef.current;

    // The next slide waits underneath; the current one fades away on top of it
    gsap.set(outSlide, { zIndex: 2 });
    gsap.set(inSlide, { zIndex: 1, visibility: "visible", opacity: 1 });

    const finish = () => {
      gsap.set(outSlide, { zIndex: 0, visibility: "hidden", opacity: 1 });
      gsap.set(outMedia, { clearProps: "transform" });
      gsap.set(outLines, { yPercent: 110, opacity: 1 });
      setTransitioning(false);
    };

    if (reducedMotion) {
      gsap.set(inLines, { yPercent: 0 });
      finish();
      setCurrent(next);
      return;
    }

    setTransitioning(true);
    timelineRef.current = gsap
      .timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish })
      // 1. Headline and card fade out, drifting down
      .to(outLines, { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.06, ease: "power2.in" }, 0)
      .to(card, { y: 48, opacity: 0, duration: 0.9, ease: "power2.in" }, 0.05)
      // 2. The photo sinks and fades while the next one settles from a slight zoom
      .to(outMedia, { yPercent: 6, duration: 1.6 }, 0.35)
      .to(outSlide, { opacity: 0, duration: 1.4 }, 0.45)
      .fromTo(inMedia, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0.35)
      // Swap the card preview while the card is invisible
      .call(() => setCurrent(next), undefined, 1)
      // 3. New headline rises in, then the card returns
      .to(inLines, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" }, 1.3)
      .to(card, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 1.75);
  }

  const advance = useEffectEvent(() => goTo((current + 1) % count));

  // Autoplay: the ring around the card button fills up, then the next slide starts.
  // Animates the SVG attribute (unitless, pathLength = 1) rather than the CSS property.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || reducedMotion || transitioning) return;
    const tween = gsap.fromTo(
      ring,
      { attr: { "stroke-dashoffset": 1 } },
      {
        attr: { "stroke-dashoffset": 0 },
        duration: AUTOPLAY_SECONDS,
        ease: "none",
        onComplete: advance,
      },
    );
    return () => {
      tween.kill();
    };
  }, [current, transitioning, reducedMotion]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured spaces"
      data-header-theme="glass"
      className="px-1 sm:px-1.5"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) > 50) goTo((current + (distance < 0 ? 1 : count - 1)) % count);
      }}
    >
      <h1 className="sr-only">Hi-Life Furniture Rentals: event furniture rental across the UAE</h1>

      <div
        ref={stageRef}
        className="relative isolate h-[calc(100svh-1rem)] min-h-[36rem] overflow-hidden rounded-b-[1.25rem] bg-forest-900 sm:h-[calc(100svh-1.5rem)] sm:rounded-b-[1.75rem]"
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            aria-hidden={index !== current}
            // Initial stacking only; GSAP owns z-index and visibility after the first transition
            className={cx("absolute inset-0 overflow-hidden", index === 0 ? "z-[1]" : "invisible z-0")}
          >
            <div
              ref={(element) => {
                mediaRefs.current[index] = element;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "eager"}
                placeholder="blur"
                sizes="100vw"
                style={{ objectPosition: slide.focus }}
                className="object-cover"
              />
            </div>

            {/* Light shading only where the headline sits */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-black/25 via-transparent to-transparent" />
            </div>

            {/*
              Bottom padding leaves room for the buttons, which stay put across slides.
              Only side-specific padding here: mixing the p shorthand with pb or pr lets the shorthand win.
            */}
            <div className="absolute inset-x-0 bottom-0 pr-5 pb-[5.5rem] pl-5 sm:pr-8 sm:pb-[8rem] sm:pl-8 lg:pr-[24rem] lg:pb-[9.5rem] lg:pl-12">
              <h2 className={cx("text-display text-white", index === 0 && "intro-hidden")}>
                {slide.headline.map((line, lineIndex) => (
                  // Each line moves inside its own mask; the padding keeps descenders visible
                  <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                    <span
                      ref={(element) => {
                        (lineRefs.current[index] ??= [])[lineIndex] = element;
                      }}
                      className="block will-change-transform"
                    >
                      {line}{" "}
                    </span>
                  </span>
                ))}
              </h2>
            </div>
          </div>
        ))}

        {/* Two equal columns on phones so both buttons always fit on one row */}
        <div
          ref={buttonsRef}
          className="intro-hidden absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-2 p-5 sm:right-auto sm:flex sm:gap-4 sm:p-8 lg:p-12"
        >
          <ButtonLink href={quoteHref} variant="copper" size="sm" className="sm:h-14 sm:px-8 sm:text-body">
            Request a Quote
          </ButtonLink>
          <ButtonLink
            href="/furniture"
            variant="outline-light"
            size="sm"
            className="backdrop-blur-sm sm:h-14 sm:px-8 sm:text-body"
          >
            Browse Furniture
          </ButtonLink>
        </div>

        {/* Card only from lg: on tablets it would collide with the buttons */}
        <div ref={cardRef} className="intro-hidden absolute right-0 bottom-0 z-10 hidden p-12 lg:block">
          <NotchCard
            onClick={() => goTo(upcoming)}
            label={`Next slide: ${upcomingSlide.headline.join(" ")}`}
            className="w-64 lg:w-72"
            cardClassName="rounded-[1.25rem] bg-copper-600/50 p-2.5 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-copper-700/70"
            notch={{ size: "3.25rem" }}
            icon={
              <>
                {/* Countdown to the next slide */}
                <svg viewBox="0 0 40 40" aria-hidden className="absolute inset-0 size-full -rotate-90">
                  <circle cx="20" cy="20" r="18" fill="none" strokeWidth="1.5" className="stroke-copper-700/20" />
                  <circle
                    ref={ringRef}
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="1"
                    className="stroke-copper-700"
                  />
                </svg>
                <ArrowUpRightIcon className="size-[45%]" />
              </>
            }
          >
            <span className="relative block aspect-[16/10] overflow-hidden rounded-xl">
              {/* Every thumbnail stays mounted so switching previews never waits on a download */}
              {heroSlides.map((slide, index) => (
                <Image
                  key={slide.id}
                  src={slide.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="18rem"
                  style={{ objectPosition: slide.focus }}
                  className={cx(
                    "object-cover transition-[scale] duration-700 group-hover:scale-105",
                    index === upcoming ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </span>
            <span className="mt-3 block max-w-[10rem] px-1.5 pb-3 text-small leading-snug">
              {upcomingSlide.headline.join(" ")}
            </span>
          </NotchCard>
        </div>
      </div>
    </section>
  );
}
