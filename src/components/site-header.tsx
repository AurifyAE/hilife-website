"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { cx } from "@/lib/cx";
import { getLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/motion";
import { mainNav, quoteHref, site } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SMOOTH = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [overGlass, setOverGlass] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);
  const glass = overGlass && !menuOpen;

  // Intro: the header drops in, then its contents fade up one by one (the hero follows)
  useGSAP(
    () => {
      const pill = pillRef.current;
      if (!pill) return;
      if (prefersReducedMotion()) {
        gsap.set(pill, { opacity: 1 });
        return;
      }
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(
          pill,
          { yPercent: -140, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        )
        .from(
          pill.querySelectorAll("[data-intro-item]"),
          { y: 10, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" },
          0.35,
        );
    },
    { scope: headerRef },
  );

  // Scroll: compact once scrolled, hide going down, return going up,
  // frosted glass while over a section marked data-header-theme="glass"
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setCompact(y > 80);
          if (y < 200) setHidden(false);
          else if (self.direction === 1) setHidden(true);
          else if (self.direction === -1) setHidden(false);
        },
      });

      const headerBottom = () => header.offsetTop + (pillRef.current?.offsetHeight ?? 64);
      gsap.utils.toArray<HTMLElement>('[data-header-theme="glass"]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: () => `top ${headerBottom()}px`,
          end: () => `bottom ${headerBottom()}px`,
          onToggle: (self) => setOverGlass(self.isActive),
        });
      });

      // Pages without a glass section start solid
      return () => setOverGlass(false);
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  const activeLink = () =>
    navRef.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? null;

  // Hover highlight: one soft pill that glides between links and rests on the current page
  function moveHighlight(target: HTMLElement | null) {
    const highlight = highlightRef.current;
    const nav = navRef.current;
    if (!highlight || !nav) return;
    if (!target) {
      gsap.to(highlight, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      return;
    }
    const x = target.getBoundingClientRect().left - nav.getBoundingClientRect().left;
    const width = target.offsetWidth;
    // Appear in place rather than sliding in from wherever it last faded out
    if (Number(gsap.getProperty(highlight, "opacity")) < 0.05) gsap.set(highlight, { x, width });
    gsap.to(highlight, {
      x,
      width,
      opacity: 1,
      duration: prefersReducedMotion() ? 0 : 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  const syncHighlight = useEffectEvent(() => moveHighlight(activeLink()));
  useEffect(() => {
    syncHighlight();
  }, [pathname]);

  // Mobile menu: panel wipes down, links fade in one by one; closing plays it back
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll("[data-menu-item]");
      const reduce = prefersReducedMotion();

      if (menuOpen) {
        getLenis()?.stop();
        gsap.set(panel, { display: "block" });
        if (reduce) {
          gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(items, { y: 0, opacity: 1 });
          return;
        }
        gsap
          .timeline()
          .fromTo(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut", overwrite: "auto" },
          )
          .fromTo(
            items,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out", overwrite: "auto" },
            0.25,
          );
      } else if (panel.style.display === "block") {
        getLenis()?.start();
        gsap
          .timeline({ onComplete: () => void gsap.set(panel, { display: "none" }) })
          .to(items, { y: -12, opacity: 0, duration: reduce ? 0 : 0.3, stagger: 0.03, ease: "power2.in", overwrite: "auto" })
          .to(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)", duration: reduce ? 0 : 0.55, ease: "power3.inOut", overwrite: "auto" },
            reduce ? 0 : 0.1,
          );
      }
    },
    { dependencies: [menuOpen] },
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // The mobile menu doesn't exist on desktop: close it if the window grows past lg
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cx(
          "fixed inset-x-0 top-4 z-50 transition-transform sm:top-6",
          SMOOTH,
          hidden && !menuOpen && "-translate-y-[calc(100%+2rem)]",
        )}
      >
        <div
          className={cx(
            "container-site transition-[max-width]",
            SMOOTH,
            // Compact still leaves ~65px spare: logo + nav + button need ~780px of the pill
            compact ? "max-w-[58rem]" : "max-w-[62rem]",
          )}
          onTransitionEnd={(event) => {
            // The links shift while the header narrows; put the highlight back on the current page
            if (event.propertyName === "max-width") moveHighlight(activeLink());
          }}
        >
          <div
            ref={pillRef}
            className={cx(
              "intro-hidden flex items-center justify-between gap-4 rounded-2xl border pr-2 pl-5 text-forest-900 transition-[height,background-color,border-color,box-shadow]",
              SMOOTH,
              compact ? "h-14" : "h-16",
              glass
                ? "border-white/50 bg-white/60 shadow-[0_8px_32px_rgb(13_35_28/0.10)] backdrop-blur-xl"
                : "border-forest-900/5 bg-white/95 shadow-[0_12px_40px_rgb(13_35_28/0.14)] backdrop-blur-md",
            )}
          >
            <Link
              href="/"
              aria-label={`${site.name} home`}
              onClick={closeMenu}
              data-intro-item
              className="shrink-0"
            >
              <Logo />
            </Link>

            <nav
              ref={navRef}
              aria-label="Main"
              className="relative hidden shrink-0 lg:block"
              onMouseLeave={() => moveHighlight(activeLink())}
            >
              <span
                ref={highlightRef}
                aria-hidden
                className={cx(
                  "absolute inset-y-0 left-0 rounded-xl opacity-0 transition-colors",
                  SMOOTH,
                  glass ? "bg-white/80" : "bg-forest-900/[0.06]",
                )}
              />
              <ul className="relative flex items-center gap-1">
                {mainNav.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href} data-intro-item>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={(event) => moveHighlight(event.currentTarget)}
                        onFocus={(event) => moveHighlight(event.currentTarget)}
                        onBlur={() => moveHighlight(activeLink())}
                        className={cx(
                          "block rounded-xl px-4 py-2 text-small font-medium whitespace-nowrap transition-colors duration-300",
                          active ? "text-forest-900" : "text-ink/70 hover:text-forest-900",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={quoteHref}
                data-intro-item
                className={cx(
                  "hidden items-center rounded-xl bg-forest-800 px-5 text-small font-semibold whitespace-nowrap text-cream-50 transition-[background-color,height] hover:bg-forest-950 sm:inline-flex",
                  SMOOTH,
                  compact ? "h-10" : "h-11",
                )}
              >
                Request a Quote
              </Link>
              <button
                type="button"
                data-intro-item
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="grid size-11 place-items-center rounded-xl bg-cream-100 lg:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={panelRef}
        id="mobile-menu"
        data-lenis-prevent
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className="fixed inset-0 z-40 hidden overflow-y-auto bg-cream-50 pt-24"
      >
        <div className="container-site flex min-h-full flex-col pb-8">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10">
              {mainNav.map((item) => (
                <li key={item.href} data-menu-item>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between py-5 text-h3 font-medium text-forest-900"
                  >
                    {item.label}
                    <ArrowUpRightIcon className="size-6 text-copper-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div data-menu-item className="mt-8">
            <ButtonLink href={quoteHref} onClick={closeMenu} variant="forest" className="w-full">
              Request a Quote
            </ButtonLink>
          </div>
          <div data-menu-item className="mt-auto space-y-1 pt-10 text-small text-stone">
            <a href={site.phoneHref} className="block">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
