"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ProductCard } from "@/components/catalogue/product-card";
import { CheckIcon, CloseIcon, SearchIcon, SlidersIcon } from "@/components/icons";
import { Select, type SelectOption } from "@/components/ui/select";
import { collections } from "@/data/collections";
import { colourSwatch, isOutdoor, type Product } from "@/lib/catalogue";
import { cx } from "@/lib/cx";
import { getLenis } from "@/lib/lenis";

type Setting = "all" | "indoor" | "outdoor";
type Sort = "featured" | "name" | "name-desc";
type Filters = { q: string; colours: string[]; setting: Setting; sort: Sort };

const NO_FILTERS: Filters = { q: "", colours: [], setting: "all", sort: "featured" };

const SORT_OPTIONS: SelectOption<Sort>[] = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

/** Cards rendered per batch: fills whole rows in the 2- and 3-column grids */
const PAGE_SIZE = 18;

type Props = {
  products: Product[];
  /** Collection slug of the current page, or null on /furniture */
  activeCollection: string | null;
  collectionCounts: Record<string, number>;
  total: number;
};

const SEARCH_CHANGE = "hilife:search-change";

function subscribeToSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(SEARCH_CHANGE, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(SEARCH_CHANGE, callback);
  };
}

/**
 * Filters live in the URL (?q=&colour=&setting=&sort=) so filtered views can be shared.
 * The site is a static export, so the URL is read in the browser: the prerendered HTML is the
 * unfiltered grid (what search engines see), and filters apply once the page has loaded.
 * This reads window.location directly rather than useSearchParams, whose Suspense fallback left
 * a second, inert copy of the catalogue on the page in the static build.
 */
export function CatalogueBrowser(props: Props) {
  const search = useSyncExternalStore(subscribeToSearch, () => window.location.search, () => "");
  const params = new URLSearchParams(search);

  const setting = params.get("setting");
  const sort = params.get("sort");
  const filters: Filters = {
    q: params.get("q") ?? "",
    colours: params.getAll("colour"),
    setting: setting === "indoor" || setting === "outdoor" ? setting : "all",
    sort: sort === "name" || sort === "name-desc" ? sort : "featured",
  };

  const onChange = (next: Filters) => {
    const nextParams = new URLSearchParams();
    if (next.q.trim()) nextParams.set("q", next.q.trim());
    next.colours.forEach((colour) => nextParams.append("colour", colour));
    if (next.setting !== "all") nextParams.set("setting", next.setting);
    if (next.sort !== "featured") nextParams.set("sort", next.sort);
    const query = nextParams.toString();
    // Next.js keeps its router in sync with native history updates
    window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
    window.dispatchEvent(new Event(SEARCH_CHANGE));
  };

  return <CatalogueView {...props} filters={filters} onChange={onChange} />;
}

function CatalogueView({
  products,
  activeCollection,
  collectionCounts,
  total,
  filters,
  onChange,
}: Props & { filters: Filters; onChange: (next: Filters) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState(filters.q);

  // The URL is only readable after hydration (and changes on back/forward): keep the box in step
  const [syncedQuery, setSyncedQuery] = useState(filters.q);
  if (filters.q !== syncedQuery) {
    setSyncedQuery(filters.q);
    setQuery(filters.q);
  }

  // Start from the first batch again whenever the filters or the product set change
  const filterKey = [filters.q, filters.colours.join(","), filters.setting, filters.sort, products.length].join("|");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [countedFor, setCountedFor] = useState(filterKey);
  if (filterKey !== countedFor) {
    setCountedFor(filterKey);
    setVisibleCount(PAGE_SIZE);
  }
  const showMore = () => setVisibleCount((count) => count + PAGE_SIZE);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clearAll = () => {
    setQuery("");
    onChange(NO_FILTERS);
  };

  // Send the search box to the URL shortly after typing stops
  const commitQuery = useEffectEvent((value: string) => {
    if (value.trim() !== filters.q) update({ q: value });
  });
  useEffect(() => {
    const timer = setTimeout(() => commitQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!drawerOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const colourCounts = new Map<string, number>();
  for (const product of products) {
    if (product.colour) colourCounts.set(product.colour, (colourCounts.get(product.colour) ?? 0) + 1);
  }
  const colourOptions = [...colourCounts].sort((a, b) => b[1] - a[1]);

  const search = filters.q.trim().toLowerCase();
  let results = products.filter(
    (product) =>
      (!search || product.name.toLowerCase().includes(search) || product.code.toLowerCase().includes(search)) &&
      (filters.colours.length === 0 || (product.colour !== null && filters.colours.includes(product.colour))) &&
      (filters.setting === "all" || (filters.setting === "outdoor") === isOutdoor(product)),
  );
  if (filters.sort === "name") results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === "name-desc") results = [...results].sort((a, b) => b.name.localeCompare(a.name));

  const activeCount = filters.colours.length + (filters.setting !== "all" ? 1 : 0) + (filters.q ? 1 : 0);

  const shown = results.slice(0, visibleCount);
  const hasMore = shown.length < results.length;

  // Load the next batch shortly before the end of the grid scrolls into view. The observer is
  // recreated after each batch, so it fires again straight away if the end is still in reach.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadNextBatch = useEffectEvent(showMore);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadNextBatch();
      },
      { rootMargin: "0px 0px 800px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  // The page got taller or shorter: re-measure scroll animations such as the footer reveal
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [shown.length]);

  const panel = (
    <div className="space-y-9">
      <FilterGroup title="Collection">
        <ul className="space-y-0.5">
          <li>
            <CollectionLink href="/furniture" label="All furniture" count={total} active={activeCollection === null} />
          </li>
          {collections.map((collection) => (
            <li key={collection.slug}>
              <CollectionLink
                href={`/furniture/${collection.slug}`}
                label={collection.name}
                count={collectionCounts[collection.slug] ?? 0}
                active={activeCollection === collection.slug}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {colourOptions.length > 1 && (
        <FilterGroup title="Colour">
          <ul className="space-y-2.5">
            {colourOptions.map(([colour, count]) => {
              const checked = filters.colours.includes(colour);
              return (
                <li key={colour}>
                  <label className="flex cursor-pointer items-center gap-3 text-small text-ink/80">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        update({
                          colours: checked ? filters.colours.filter((c) => c !== colour) : [...filters.colours, colour],
                        })
                      }
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="grid size-5 shrink-0 place-items-center rounded-md border border-forest-900/25 text-cream-50 transition-colors *:opacity-0 peer-checked:border-forest-900 peer-checked:bg-forest-900 peer-checked:*:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper-500"
                    >
                      <CheckIcon className="size-3.5" />
                    </span>
                    <span
                      aria-hidden
                      className="size-3.5 shrink-0 rounded-full border border-forest-900/15"
                      style={{ background: colourSwatch(colour) }}
                    />
                    <span className="flex-1">{colour}</span>
                    <span className="text-stone/70 tabular-nums">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Setting">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Setting">
          {(["all", "indoor", "outdoor"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={filters.setting === option}
              onClick={() => update({ setting: option })}
              className={cx(
                "h-9 cursor-pointer rounded-full border px-4 text-small capitalize transition-colors",
                filters.setting === option
                  ? "border-forest-900 bg-forest-900 text-cream-50"
                  : "border-forest-900/15 text-forest-900 hover:border-forest-900/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer text-small font-semibold text-copper-700 underline underline-offset-4"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-site grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-28">{panel}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3 border-b border-forest-900/10 pb-5">
          {/* Full-width search on phones, with Filters and Sort on the row below */}
          <label className="relative w-full sm:w-auto sm:min-w-[12rem] sm:flex-1">
            <span className="sr-only">Search furniture</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or code"
              className="h-11 w-full rounded-full border border-forest-900/15 bg-white pr-4 pl-11 text-small text-ink placeholder:text-stone/70 focus:border-forest-900 focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-forest-900/15 px-4 text-small font-semibold text-forest-900 lg:hidden"
          >
            <SlidersIcon className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-copper-600 text-[0.6875rem] text-white">
                {activeCount}
              </span>
            )}
          </button>

          <Select
            label="Sort"
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={(sort) => update({ sort })}
            className="ml-auto"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-small text-stone" aria-live="polite">
            {results.length === products.length
              ? `${products.length} pieces`
              : `${results.length} of ${products.length} pieces`}
          </p>
          {filters.q && (
            <Chip
              label={`“${filters.q}”`}
              onRemove={() => {
                setQuery("");
                update({ q: "" });
              }}
            />
          )}
          {filters.colours.map((colour) => (
            <Chip
              key={colour}
              label={colour}
              onRemove={() => update({ colours: filters.colours.filter((c) => c !== colour) })}
            />
          ))}
          {filters.setting !== "all" && <Chip label={filters.setting} onRemove={() => update({ setting: "all" })} />}
        </div>

        {results.length > 0 ? (
          <>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 2xl:grid-cols-4">
              {shown.map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
            {hasMore && (
              <div ref={sentinelRef} className="mt-14 flex flex-col items-center gap-4">
                <p className="text-small text-stone">
                  Showing {shown.length} of {results.length}
                </p>
                <button
                  type="button"
                  onClick={showMore}
                  className="h-11 cursor-pointer rounded-full border border-forest-900/20 px-6 text-small font-semibold text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-[1.5rem] bg-cream-100 px-6 py-16 text-center">
            <p className="text-h5 text-forest-900">No pieces match these filters</p>
            <p className="mt-2 text-small text-stone">
              Try another colour or search, or tell us what you need in a quote request.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 h-11 cursor-pointer rounded-full bg-forest-800 px-6 text-small font-semibold text-cream-50 hover:bg-forest-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 cursor-default bg-forest-950/40"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(24rem,90vw)] flex-col bg-cream-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-forest-900/10 px-6 py-4">
              <p className="text-h5 text-forest-900">Filters</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="grid size-10 cursor-pointer place-items-center rounded-full bg-cream-100"
              >
                <CloseIcon />
              </button>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-8">
              {panel}
            </div>
            <div className="border-t border-forest-900/10 p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="h-12 w-full cursor-pointer rounded-full bg-forest-800 font-semibold text-cream-50"
              >
                Show {results.length} pieces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow mb-4 text-copper-600">{title}</h2>
      {children}
    </section>
  );
}

function CollectionLink({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex items-center justify-between rounded-lg px-3 py-2 text-small transition-colors",
        active ? "bg-forest-900 font-semibold text-cream-50" : "text-ink/80 hover:bg-cream-100 hover:text-forest-900",
      )}
    >
      {label}
      <span className={cx("tabular-nums", active ? "text-cream-50/70" : "text-stone/70")}>{count}</span>
    </Link>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-forest-100 pr-2 pl-3 text-small text-forest-900 capitalize hover:bg-forest-900 hover:text-cream-50"
    >
      {label}
      <CloseIcon className="size-3.5" />
    </button>
  );
}
