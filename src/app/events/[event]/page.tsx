import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/catalogue/catalogue-header";
import { ProductCard } from "@/components/catalogue/product-card";
import { FaqList } from "@/components/events/faq-list";
import { ProcessSteps } from "@/components/events/process-steps";
import { CtaSection } from "@/components/home/cta-section";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { NotchCard } from "@/components/ui/notch-card";
import { eventDetails, type EventDetails } from "@/data/event-details";
import { eventTypes, getEventType } from "@/data/events";
import { featuredProjects } from "@/data/projects";
import { collectionCounts, getCollection, products } from "@/lib/catalogue";
import { quoteHref } from "@/lib/site";

// Static export: one page per event type, generated at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return eventTypes.map((event) => ({ event: event.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[event]">): Promise<Metadata> {
  const event = getEventType((await params).event);
  const details = event && eventDetails[event.slug];
  if (!event || !details) return {};
  return {
    title: `${event.name} Furniture Rental`,
    description: `${details.headline} ${event.description}`,
  };
}

/** The hand-picked pieces for an event, skipping any code no longer in the catalogue */
function popularPieces(details: EventDetails) {
  return details.featured
    .map((code) => products.find((product) => product.code === code))
    .filter((product) => product !== undefined);
}

export default async function EventPage({ params }: PageProps<"/events/[event]">) {
  const event = getEventType((await params).event);
  const details = event && eventDetails[event.slug];
  if (!event || !details) notFound();

  const quote = `${quoteHref}?event=${event.slug}`;
  const suitedCollections = event.collections.map(getCollection).filter((collection) => collection !== undefined);
  const pieces = popularPieces(details);
  const project = featuredProjects.find((item) => item.eventSlug === event.slug);
  const otherEvents = eventTypes.filter((item) => item.slug !== event.slug);
  const lowerName = event.name.toLowerCase();

  return (
    <>
      <header className="container-site pt-32 lg:pt-40">
        <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.name }]} />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow text-copper-600">Events we furnish</p>
            <h1 className="mt-4 text-h1 text-forest-900">{event.name}</h1>
            <p className="mt-5 text-lead font-medium text-forest-900">{details.headline}</p>
            <p className="mt-4 text-stone">{details.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quote} variant="forest" size="md">
                Plan your event
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="#popular-pieces" variant="outline-dark" size="md">
                See popular pieces
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="shape-brand relative aspect-[4/3] overflow-hidden bg-forest-900">
              <Image
                src={event.image}
                alt=""
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1024px) 55vw, 100vw"
                style={{ objectPosition: event.focus }}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="highlights-heading" className="container-site mt-16 lg:mt-24">
        <h2 id="highlights-heading" className="sr-only">
          What we take care of
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {details.highlights.map((highlight, index) => (
            <li key={highlight.title} className="rounded-[1.5rem] bg-cream-100 p-7">
              <span className="text-small font-semibold text-copper-600 tabular-nums">0{index + 1}</span>
              <h3 className="mt-3 text-h5 font-semibold text-forest-900">{highlight.title}</h3>
              <p className="mt-2 text-small text-stone">{highlight.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="collections-heading" className="container-site section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-copper-600">Collections</p>
            <h2 id="collections-heading" className="mt-4 text-h2 text-forest-900">
              Furniture that suits {lowerName}
            </h2>
          </div>
          <ArrowLink href="/furniture">Browse all furniture</ArrowLink>
        </div>

        <ul className="mt-10 grid gap-x-5 gap-y-10 md:grid-cols-3">
          {suitedCollections.map((collection) => (
            <li key={collection.slug} className="flex flex-col gap-5">
              <NotchCard
                href={`/furniture/${collection.slug}`}
                label={collection.name}
                className="aspect-[4/3]"
                cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.5rem]"
                actionClassName="bg-white/85 text-forest-900 backdrop-blur-md group-hover:bg-copper-500 group-hover:text-white"
              >
                <Image
                  src={collection.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 30vw, 100vw"
                  style={{ objectPosition: collection.focus }}
                  className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                />
              </NotchCard>
              <div className="px-1">
                <h3 className="text-h4 text-forest-900">
                  <Link
                    href={`/furniture/${collection.slug}`}
                    className="decoration-copper-500 underline-offset-4 hover:underline"
                  >
                    {collection.name}
                  </Link>
                </h3>
                <p className="mt-1 text-small text-stone">{collection.description}</p>
                <p className="mt-2 text-small font-medium text-copper-700">
                  {collectionCounts[collection.slug] ?? 0} pieces
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {pieces.length > 0 && (
        <section
          id="popular-pieces"
          aria-labelledby="pieces-heading"
          className="container-site scroll-mt-28 pb-[clamp(4.5rem,3.2rem+5vw,8rem)]"
        >
          <div className="flex flex-col gap-6 border-t border-forest-900/10 pt-[clamp(4.5rem,3.2rem+5vw,8rem)] md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-copper-600">Popular pieces</p>
              <h2 id="pieces-heading" className="mt-4 text-h2 text-forest-900">
                Start your list
              </h2>
              <p className="mt-4 text-stone">
                Add pieces to your enquiry now, or open one to see its dimensions and photos.
              </p>
            </div>
            <ArrowLink href={`/furniture/${event.collections[0]}`}>
              More {getCollection(event.collections[0])?.name.toLowerCase()}
            </ArrowLink>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {pieces.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProcessSteps />

      {project && (
        <section aria-labelledby="project-heading" className="container-site section-y">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <NotchCard
                href={`/portfolio/${project.slug}`}
                label={project.title}
                className="aspect-[4/3]"
                cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.75rem]"
                actionClassName="bg-copper-500 text-white group-hover:bg-forest-900"
                notch={{ size: "clamp(3.25rem, 2.5rem + 1.5vw, 4.25rem)" }}
              >
                <Image
                  src={project.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  style={{ objectPosition: project.focus }}
                  className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                />
              </NotchCard>
            </div>
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow text-copper-600">From our portfolio</p>
                {project.sample && (
                  <span className="rounded-full bg-copper-100 px-2.5 py-0.5 text-[0.75rem] font-medium text-copper-700">
                    Sample project
                  </span>
                )}
              </div>
              <h2 id="project-heading" className="mt-4 text-h3 text-forest-900">
                {project.title}
              </h2>
              <p className="mt-2 text-small font-medium text-stone">
                {project.location} · {project.eventType}
              </p>
              <p className="mt-5 text-stone">{project.summary}</p>
              <div className="mt-8">
                <ArrowLink href={`/portfolio/${project.slug}`}>View project</ArrowLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <FaqList faqs={details.faqs} />

      <nav aria-labelledby="other-events-heading" className="container-site">
        <div className="rounded-[1.75rem] bg-cream-100 p-6 sm:p-8">
          <h2 id="other-events-heading" className="text-h5 font-semibold text-forest-900">
            Other events we furnish
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {otherEvents.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/events/${item.slug}`}
                  className="inline-flex h-10 items-center rounded-full border border-forest-900/15 bg-white px-4 text-small text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaSection href={quote} />
    </>
  );
}

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 self-start text-small font-semibold tracking-wide whitespace-nowrap text-forest-900 md:self-auto"
    >
      {children}
      <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
        <ArrowRightIcon className="size-4" />
      </span>
    </Link>
  );
}
