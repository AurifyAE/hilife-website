"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { cx } from "@/lib/cx";
import { mainNav, quoteHref, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

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

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 sm:top-6">
        <div className="container-site max-w-[62rem]">
          <div className="flex h-16 items-center justify-between gap-4 rounded-2xl bg-white/95 pr-2.5 pl-5 text-forest-900 shadow-[0_8px_30px_rgb(13_35_28/0.12)] backdrop-blur-md">
            <Link href="/" aria-label={`${site.name} home`} onClick={closeMenu}>
              <Logo />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {mainNav.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "text-small font-medium transition-colors hover:text-copper-600",
                          active ? "text-copper-600" : "text-ink/80",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={quoteHref}
                className="hidden h-11 items-center rounded-xl bg-forest-800 px-5 text-small font-semibold text-cream-50 transition-colors hover:bg-forest-950 sm:inline-flex"
              >
                Request a Quote
              </Link>
              <button
                type="button"
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
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 overflow-y-auto bg-cream-50 pt-24 lg:hidden"
      >
        <div className="container-site flex min-h-full flex-col pb-8">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10">
              {mainNav.map((item) => (
                <li key={item.href}>
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
          <ButtonLink
            href={quoteHref}
            onClick={closeMenu}
            variant="forest"
            className="mt-8 w-full"
          >
            Request a Quote
          </ButtonLink>
          <div className="mt-auto space-y-1 pt-10 text-small text-stone">
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
