"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import loungeSet from "@/assets/photos/cta/lounge-set.webp";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { NotchCard } from "@/components/ui/notch-card";
import { quoteHref, site } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Closing quote band. Event pages pass an href that preselects their event type on the quote form. */
export function CtaSection({ href = quoteHref }: { href?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true } })
          .from("[data-cta-line]", { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out" }, 0)
          .from("[data-cta-reveal]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.4)
          .fromTo(
            "[data-cta-photo]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", clearProps: "clipPath" },
            0.1,
          );
      });
    },
    { scope: sectionRef },
  );

  return (
    // No background of its own: it shows <main>'s cream, so main's rounded bottom corners stay visible
    <section ref={sectionRef} id="get-a-quote" aria-labelledby="cta-heading" className="section-y">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <p data-cta-reveal className="eyebrow text-copper-600">
            Start planning
          </p>
          <h2
            id="cta-heading"
            className="mt-5 text-[clamp(2.5rem,1.4rem+4.4vw,5.5rem)] leading-[1] font-medium tracking-[-0.03em] text-forest-900"
          >
            {/* Each line rises inside its own mask; the padding keeps descenders visible */}
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span data-cta-line className="block">
                Let&apos;s furnish{" "}
              </span>
            </span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span data-cta-line className="block">
                your <span className="font-light text-copper-600 italic">next event.</span>
              </span>
            </span>
          </h2>
          <p data-cta-reveal className="mt-6 max-w-lg text-lead text-stone">
            Send us the date, the venue and the pieces you have in mind. We&apos;ll check availability
            and come back to you with a quote.
          </p>
          <div data-cta-reveal className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={href} variant="forest">
              Request a Quote
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="outline-dark">
              <PhoneIcon className="size-4" />
              {site.phone}
            </ButtonLink>
          </div>
        </div>

        <div data-cta-photo className="lg:col-span-5">
          <NotchCard
            href={href}
            label="Request a quote"
            className="aspect-[4/3] lg:aspect-[4/5]"
            cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.75rem]"
            actionClassName="bg-copper-500 text-white group-hover:bg-forest-900"
            notch={{ size: "clamp(3.25rem, 2.5rem + 1.5vw, 4.25rem)" }}
          >
            <Image
              src={loungeSet}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 100vw"
              style={{ objectPosition: "55% 60%" }}
              className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
            />
          </NotchCard>
        </div>
      </div>
    </section>
  );
}
