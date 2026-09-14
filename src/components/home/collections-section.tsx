import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { NotchCard } from "@/components/ui/notch-card";
import { collections } from "@/data/collections";
import { cx } from "@/lib/cx";

export function CollectionsSection() {
  return (
    <section id="collections" className="section-y scroll-mt-24 bg-cream-50">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-copper-600">Our Collections</p>
            <h2 className="mt-4 text-h2 text-forest-900">Nine collections for every kind of event</h2>
            <p className="mt-5 text-lead text-stone">
              From banquet chairs to outdoor lounges and appliances, pick the pieces you need
              and send one enquiry for all of them.
            </p>
          </div>
          <Link
            href="/furniture"
            className="group inline-flex items-center gap-3 self-start text-small font-semibold tracking-wide text-forest-900 md:self-auto"
          >
            View all furniture
            <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
              <ArrowRightIcon className="size-4" />
            </span>
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:mt-16">
          {collections.map((collection, index) => {
            const last = index === collections.length - 1;
            return (
              <li key={collection.slug} className={cx(last && "col-span-2 md:col-span-1")}>
                <NotchCard
                  href={`/furniture/${collection.slug}`}
                  className={last ? "aspect-[16/10] md:aspect-[4/5]" : "aspect-[3/4] md:aspect-[4/5]"}
                  cardClassName="shape-brand bg-forest-900"
                  actionClassName="bg-forest-900 text-cream-50 group-hover:bg-copper-500"
                  notch={{
                    size: "clamp(2.75rem, 2rem + 2vw, 4rem)",
                    corner: "clamp(0.75rem, 0.5rem + 0.6vw, 1.25rem)",
                  }}
                >
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 33vw, 50vw"
                    style={{ objectPosition: collection.focus }}
                    className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-t from-forest-950/90 via-forest-950/25 to-transparent"
                  />
                  {/* Right padding keeps the text clear of the notch */}
                  <div className="absolute inset-x-0 bottom-0 pr-[calc(var(--notch-size)+1rem)] pb-4 pl-4 sm:pr-[calc(var(--notch-size)+1.5rem)] sm:pb-6 sm:pl-6 lg:pr-[calc(var(--notch-size)+2rem)] lg:pb-8 lg:pl-8">
                    <span className="text-small font-medium text-copper-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-h6 text-cream-50 sm:text-h4">{collection.name}</h3>
                    <p className="mt-2 hidden max-w-xs text-small text-cream-50/75 lg:block">
                      {collection.description}
                    </p>
                  </div>
                </NotchCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
