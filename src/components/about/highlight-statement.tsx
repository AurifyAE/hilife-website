"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cx } from "@/lib/cx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Large statement whose words start faint and light up one by one as it scrolls through view */
export function HighlightStatement({
  segments,
  className,
}: {
  segments: { text: string; accent: boolean }[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 55%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      className={cx(
        "text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] leading-[1.18] font-medium tracking-[-0.02em] text-balance",
        className,
      )}
    >
      {segments.map((segment, segmentIndex) =>
        segment.text.split(" ").map((word, wordIndex) => (
          <span
            key={`${segmentIndex}-${wordIndex}`}
            data-word
            className={cx(segment.accent && "font-light text-copper-600 italic")}
          >
            {word}{" "}
          </span>
        )),
      )}
    </p>
  );
}
