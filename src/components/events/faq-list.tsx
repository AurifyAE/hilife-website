"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlusIcon } from "@/components/icons";
import type { Faq } from "@/data/event-details";
import { site } from "@/lib/site";

/** Questions as native disclosure widgets, so they work without JavaScript */
export function FaqList({ faqs, title = "Good to know" }: { faqs: Faq[]; title?: string }) {
  return (
    <section aria-labelledby="faq-heading" className="container-site section-y grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <p className="eyebrow text-copper-600">Questions</p>
        <h2 id="faq-heading" className="mt-4 text-h2 text-forest-900">
          {title}
        </h2>
        <p className="mt-5 text-stone">
          Can&apos;t find your answer? Call us on{" "}
          <a href={site.phoneHref} className="font-semibold whitespace-nowrap text-forest-900 underline underline-offset-4">
            {site.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-forest-900 underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </div>

      <div className="divide-y divide-forest-900/10 border-y border-forest-900/10 lg:col-span-8">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            // Opening an answer moves everything below it: re-measure the scroll animations
            onToggle={() => requestAnimationFrame(() => ScrollTrigger.refresh())}
            className="group"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-h5 font-medium text-forest-900 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full border border-forest-900/15 transition-[rotate,background-color,color] duration-300 group-open:rotate-45 group-open:border-forest-900 group-open:bg-forest-900 group-open:text-cream-50 group-hover:border-forest-900"
              >
                <PlusIcon className="size-4" />
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-stone">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
