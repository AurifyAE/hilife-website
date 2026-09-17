"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { collections } from "@/data/collections";
import { eventTypes } from "@/data/events";
import { getLenis } from "@/lib/lenis";
import { quoteHref, site } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WORDMARK = "HI-LIFE";

const columns = [
  {
    title: "Collections",
    links: collections.map((collection) => ({ label: collection.name, href: `/furniture/${collection.slug}` })),
  },
  {
    title: "Events",
    links: eventTypes.map((event) => ({ label: event.name, href: `/events/${event.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
      { label: "Request a Quote", href: quoteHref },
    ],
  },
];

/**
 * On desktop the footer sits sticky underneath <main>, which lifts away like a curtain to reveal it
 * (see the z-index, rounded corners and shadow on <main> in layout.tsx).
 */
export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      const main = document.getElementById("main");
      if (!footer || !main) return;

      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        // Wordmark letters rise as the page lifts off the footer, finishing when it's fully revealed
        gsap.fromTo(
          "[data-wordmark-letter]",
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: main,
              start: "bottom bottom",
              end: () => `bottom ${window.innerHeight - footer.offsetHeight}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: footerRef },
  );

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Curtain only when the whole footer fits on screen (desktop width and at least 44rem tall)
    <footer
      ref={footerRef}
      className="bg-forest-950 text-cream-50 lg:z-0 lg:[@media(min-height:44rem)]:sticky lg:[@media(min-height:44rem)]:bottom-0"
    >
      <div className="container-site pt-16 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" aria-label={`${site.name} home`} className="inline-block">
              <Logo tone="light" className="h-14" />
            </Link>
            <p className="mt-6 max-w-xs text-small text-cream-50/60">
              Premium rental furniture for events, exhibitions and fit-outs across the UAE.
            </p>
            <ul className="mt-8 space-y-3 text-small">
              <li>
                <a href={site.phoneHref} className="inline-flex items-center gap-3 transition-colors hover:text-copper-300">
                  <PhoneIcon className="size-4 shrink-0 text-copper-300" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-copper-300"
                >
                  <MailIcon className="size-4 shrink-0 text-copper-300" />
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3 text-cream-50/70">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-copper-300" />
                <span className="max-w-[16rem]">{site.address}</span>
              </li>
            </ul>
          </div>

          {columns.map((column, index) => (
            <nav
              key={column.title}
              aria-label={`${column.title} links`}
              className={index === 2 ? "lg:col-span-2" : "lg:col-span-3"}
            >
              <h2 className="eyebrow text-copper-300">{column.title}</h2>
              <ul className="mt-5 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-small text-cream-50/70 transition-colors hover:text-cream-50">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream-50/10 pt-6 text-[0.8125rem] text-cream-50/50 md:flex-row md:items-center md:justify-between lg:mt-14">
          <p>© 2026 Hi-Life Furniture Rentals · Palm Corner Events L.L.C SP</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-cream-50">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cream-50">
              Terms
            </Link>
            <button
              type="button"
              onClick={backToTop}
              className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-cream-50"
            >
              Back to top
              <ArrowUpIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark: placeholder text until the official logo arrives */}
      <div aria-hidden className="container-site mt-6 overflow-hidden">
        <p className="flex justify-between text-[17vw] leading-[0.78] font-semibold tracking-[-0.04em] text-forest-800 select-none lg:text-[min(14vw,13rem)]">
          {WORDMARK.split("").map((letter, index) => (
            <span key={index} data-wordmark-letter className="inline-block">
              {letter}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
