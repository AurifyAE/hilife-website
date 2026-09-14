"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { cx } from "@/lib/cx";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AUTOPLAY_SECONDS = 7;

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const quoteRefs = useRef<(HTMLElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const count = testimonials.length;

  useGSAP(
    () => {
      // Autoplay only while the section is on screen
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });
    },
    { scope: sectionRef },
  );

  // Stop a running transition if the section unmounts
  useEffect(() => () => void timelineRef.current?.kill(), []);

  // Runs from clicks and autoplay only, never during render
  function goTo(next: number) {
    if (next === active || timelineRef.current?.isActive()) return;
    const outgoing = quoteRefs.current[active];
    const incoming = quoteRefs.current[next];
    if (!outgoing || !incoming) return;
    const outWords = outgoing.querySelectorAll("[data-quote-word]");
    const inWords = incoming.querySelectorAll("[data-quote-word]");

    setActive(next);

    if (reducedMotion) {
      gsap.set(outgoing, { autoAlpha: 0 });
      gsap.set(incoming, { autoAlpha: 1 });
      gsap.set(inWords, { y: 0, opacity: 1 });
      return;
    }

    // Current words drift up and fade, then the next quote rises in word by word
    timelineRef.current = gsap
      .timeline()
      .to(outWords, { y: -16, opacity: 0, duration: 0.45, stagger: 0.008, ease: "power2.in" })
      .set(outgoing, { autoAlpha: 0 })
      .set(incoming, { autoAlpha: 1 })
      .fromTo(
        inWords,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.015, ease: "power3.out" },
      );
  }

  const advance = useEffectEvent(() => goTo((active + 1) % count));

  // The ring around the active client fills up, then the next quote comes in
  useEffect(() => {
    const ring = ringRefs.current[active];
    if (!ring || !inView || reducedMotion) return;
    const tween = gsap.fromTo(
      ring,
      { attr: { "stroke-dashoffset": 1 } },
      { attr: { "stroke-dashoffset": 0 }, duration: AUTOPLAY_SECONDS, ease: "none", onComplete: advance },
    );
    return () => {
      tween.kill();
      gsap.set(ring, { attr: { "stroke-dashoffset": 1 } });
    };
  }, [active, inView, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section-y bg-cream-50"
    >
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="eyebrow text-copper-600">Client stories</p>
          <h2 id="testimonials-heading" className="mt-4 text-h2 text-forest-900">
            What our clients say
          </h2>
          <p className="mt-5 max-w-sm text-stone">
            Event agencies, planners, hotels and exhibition teams on working with Hi-Life.
          </p>
        </div>

        <div className="lg:col-span-8">
          {/* All quotes share one grid cell, so the section keeps the height of the longest */}
          <div className="grid">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.initials}
                ref={(element) => {
                  quoteRefs.current[index] = element;
                }}
                aria-hidden={index !== active}
                className={cx("[grid-area:1/1]", index !== 0 && "invisible")}
              >
                <span aria-hidden className="block text-[5rem] leading-[0.6] font-light text-copper-500">
                  &ldquo;
                </span>
                <blockquote className="mt-4 text-[clamp(1.5rem,1rem+2vw,2.625rem)] leading-[1.25] font-medium tracking-[-0.015em] text-forest-900">
                  <p>
                    {testimonial.quote.split(" ").map((word, wordIndex) => (
                      <span key={wordIndex}>
                        {wordIndex > 0 && " "}
                        <span data-quote-word className="inline-block">
                          {word}
                        </span>
                      </span>
                    ))}
                  </p>
                </blockquote>
                <figcaption data-quote-word className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-small font-semibold text-forest-900">{testimonial.role}</span>
                  <span className="text-small text-stone">
                    {testimonial.company}, {testimonial.location}
                  </span>
                  {testimonial.sample && (
                    <span className="rounded-full bg-copper-100 px-2.5 py-0.5 text-[0.75rem] font-medium text-copper-700">
                      Sample testimonial
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Phones: a row of avatars. Wider screens: a tidy 2 × 2 grid, since four named buttons don't fit one row */}
          <ul
            className="mt-10 flex flex-wrap gap-2 border-t border-forest-900/10 pt-8 sm:grid sm:grid-cols-2"
            aria-label="Choose a client"
          >
            {testimonials.map((testimonial, index) => {
              const selected = index === active;
              return (
                <li key={testimonial.initials}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-pressed={selected}
                    aria-label={`Show quote from the ${testimonial.company.toLowerCase()} in ${testimonial.location}`}
                    className={cx(
                      "flex w-full cursor-pointer items-center gap-3 rounded-full py-1.5 pl-1.5 text-left transition-[background-color,box-shadow,opacity] duration-300 sm:pr-5",
                      selected
                        ? "bg-white shadow-[0_8px_24px_rgb(13_35_28/0.08)]"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <span className="relative grid size-12 shrink-0 place-items-center">
                      {/* Countdown to the next quote */}
                      <svg viewBox="0 0 48 48" aria-hidden className="absolute inset-0 size-full -rotate-90">
                        <circle cx="24" cy="24" r="22.5" fill="none" strokeWidth="1.5" className="stroke-forest-900/10" />
                        <circle
                          ref={(element) => {
                            ringRefs.current[index] = element;
                          }}
                          cx="24"
                          cy="24"
                          r="22.5"
                          fill="none"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          pathLength={1}
                          strokeDasharray="1"
                          strokeDashoffset="1"
                          className="stroke-copper-500"
                        />
                      </svg>
                      <span className="grid size-9 place-items-center rounded-full bg-forest-900 text-[0.75rem] font-semibold tracking-wide text-cream-50">
                        {testimonial.initials}
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      <span className="block text-small font-semibold whitespace-nowrap text-forest-900">
                        {testimonial.company}
                      </span>
                      <span className="block text-[0.75rem] text-stone">{testimonial.location}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
