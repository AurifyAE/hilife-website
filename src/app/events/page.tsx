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
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event Furniture Rental",
  description:
    "Rental furniture for corporate events, weddings, exhibitions, brand activations, fit-outs, outdoor events and temporary offices, delivered across the UAE.",
};

export default function EventsPage() {
  return (
    <>
      <div className="container-site pt-32 pb-24 lg:pt-40 lg:pb-32">
        <Breadcrumbs items={[{ label: "Events" }]} />

        {/* The intro takes the first cells so the grid has no gaps: 1 + 7 cards on tablets, 2 + 7 on desktop */}
        <div className="mt-8 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          <header className="flex flex-col md:pr-4 lg:col-span-2 lg:pr-24">
            <p className="eyebrow text-copper-600">Events we furnish</p>
            <h1 className="mt-4 text-h1 text-forest-900">Furniture for every kind of event</h1>
            <p className="mt-5 max-w-2xl text-lead text-stone">
              Whatever you&apos;re planning, start with the event. Each page shows the collections that suit it,
              popular pieces and answers to common questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quoteHref} variant="forest" size="md">
                Request a Quote
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="/furniture" variant="outline-dark" size="md">
                Browse furniture
              </ButtonLink>
            </div>
            <p className="mt-10 border-t border-forest-900/10 pt-5 text-small text-stone lg:mt-auto">
              {eventTypes.length} event types · Delivery and collection across the UAE
            </p>
          </header>

          {eventTypes.map((event, index) => (
            <EventCard key={event.slug} event={event} index={index} />
          ))}
        </div>
      </div>

      <ProcessSteps />
      <FaqList faqs={generalFaqs} />
      <CtaSection />
    </>
  );
}
