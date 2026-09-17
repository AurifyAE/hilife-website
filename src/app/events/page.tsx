import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/catalogue/catalogue-header";
import { EventCard } from "@/components/events/event-card";
import { FaqList } from "@/components/events/faq-list";
import { ProcessSteps } from "@/components/events/process-steps";
import { CtaSection } from "@/components/home/cta-section";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { generalFaqs } from "@/data/event-details";
import { eventTypes } from "@/data/events";
import { cx } from "@/lib/cx";
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event Furniture Rental",
  description:
    "Rental furniture for corporate events and exhibitions, weddings, brand activations, outdoor events and temporary offices, delivered across the UAE.",
};

export default function EventsPage() {
  return (
    <>
      <div className="container-site pt-32 pb-24 lg:pt-40 lg:pb-32">
        <Breadcrumbs items={[{ label: "Events" }]} />

        <header className="mt-8 grid gap-8 border-b border-forest-900/10 pb-12 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-8">
            <p className="eyebrow text-copper-600">Events we furnish</p>
            <h1 className="mt-4 text-h1 text-forest-900">Furniture for every kind of event</h1>
            <p className="mt-5 max-w-2xl text-lead text-stone">
              Whatever you&apos;re planning, start with the event. Each page shows the collections that suit it,
              popular pieces and answers to common questions.
            </p>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href={quoteHref} variant="forest" size="md">
                Request a Quote
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="/furniture" variant="outline-dark" size="md">
                Browse furniture
              </ButtonLink>
            </div>
            <p className="text-small text-stone lg:text-right">
              {eventTypes.length} event types · Delivery and collection across the UAE
            </p>
          </div>
        </header>

        {/*
          Five cards with no gaps: on tablets the first card runs full width, then two pairs;
          on desktop three cards, then two wider ones (a 6-column grid).
        */}
        <div className="mt-12 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-6">
          {eventTypes.map((event, index) => (
            <EventCard
              key={event.slug}
              event={event}
              index={index}
              className={cx(index === 0 && "md:col-span-2", index < 3 ? "lg:col-span-2" : "lg:col-span-3")}
              photoClassName={cx(index === 0 && "md:aspect-[16/7] lg:aspect-[4/3]", index >= 3 && "lg:aspect-[16/10]")}
            />
          ))}
        </div>
      </div>

      <ProcessSteps />
      <FaqList faqs={generalFaqs} />
      <CtaSection />
    </>
  );
}
