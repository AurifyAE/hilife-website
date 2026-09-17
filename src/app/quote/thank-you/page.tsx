import type { Metadata } from "next";
import { CheckIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quote request sent",
  robots: { index: false },
};

const steps = [
  { title: "We check availability", text: "Our team confirms the pieces and quantities for your event dates." },
  { title: "You get your quote", text: "We reply by email or phone with a quote for delivery, set-up and collection." },
  { title: "We furnish your event", text: "Once you confirm, we deliver and set up anywhere in the UAE." },
];

export default function QuoteThankYouPage() {
  return (
    <section className="container-site pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-forest-100 text-forest-900 motion-safe:animate-[menu-in_600ms_cubic-bezier(0.22,1,0.36,1)]">
          <CheckIcon className="size-7" />
        </span>
        <p className="eyebrow mt-8 text-copper-600">Request received</p>
        <h1 className="mt-4 text-h1 text-forest-900">Thank you, your request is on its way</h1>
        <p className="mt-5 text-lead text-stone">
          We&apos;ve received your furniture list and event details. Someone from our team will be in touch soon.
        </p>
      </div>

      <ol className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-[1.5rem] bg-cream-100 p-6">
            <span className="text-small font-semibold text-copper-600 tabular-nums">0{index + 1}</span>
            <h2 className="mt-3 text-h5 font-semibold text-forest-900">{step.title}</h2>
            <p className="mt-2 text-small text-stone">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/furniture" variant="forest">
          Keep browsing furniture
        </ButtonLink>
        <ButtonLink href={site.phoneHref} variant="outline-dark">
          Call {site.phone}
        </ButtonLink>
      </div>
    </section>
  );
}
