"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Copy from the Hi-Life rental catalogue
const statement = [
  { text: "From empty space to", accent: false },
  { text: "unforgettable place.", accent: true },
  {
    text: "Great events are remembered for how they feel. We bring the furniture, the flexibility and the expertise to turn your vision into a space worth remembering.",
    accent: false,
  },
];

const companies = [
  { label: "Part of", name: "Hi-Life Group" },
  { label: "Company", name: "Hi-Life Furniture Rentals" },
  { label: "Part of", name: "VK Exhibitions & Decor Industry LLC" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        // Words start faint and light up one by one, tied to scroll position
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: statementRef.current, start: "top 80%", end: "bottom 50%", scrub: true },
          },
        );

        gsap.from("[data-about-reveal]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: groupRef.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-heading" className="section-y bg-forest-900 text-cream-50">
      <div className="container-site">
        <h2 id="about-heading" className="eyebrow text-copper-300">
          About Hi-Life
        </h2>

        <p
          ref={statementRef}
          className="mt-8 max-w-[62rem] text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] leading-[1.18] font-medium tracking-[-0.02em] text-balance"
        >
          {statement.map((segment, segmentIndex) =>
            segment.text.split(" ").map((word, wordIndex) => (
              <span
                key={`${segmentIndex}-${wordIndex}`}
                data-word
                className={cx(segment.accent && "font-light text-copper-300 italic")}
              >
                {word}{" "}
              </span>
            )),
          )}
        </p>

        <div ref={groupRef} className="mt-16 grid gap-10 border-t border-cream-50/15 pt-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p data-about-reveal className="max-w-md text-cream-50/70">
              Hi-Life Furniture Rentals is part of the Hi-Life Group and a sister company of VK
              Exhibitions &amp; Decor Industry LLC, based in Sharjah and delivering across the UAE.
            </p>
            <Link
              data-about-reveal
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 text-small font-semibold tracking-wide text-cream-50"
            >
              More about us
              <span className="grid size-10 place-items-center rounded-full border border-cream-50/25 transition-colors group-hover:border-copper-500 group-hover:bg-copper-500 group-hover:text-white">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
            {companies.map((company) => (
              <li
                key={company.name}
                data-about-reveal
                className="flex flex-col justify-between gap-6 rounded-[1.25rem] border border-cream-50/15 p-5 lg:p-6"
              >
                <span className="eyebrow text-copper-300">{company.label}</span>
                {/* Text mark until the company logos are supplied */}
                <span className="text-h6 text-cream-50">{company.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
