import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { ContactForm } from "@/components/contact/contact-form";
import { ArrowRightIcon, ArrowUpRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { quoteHref, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description: `Call, WhatsApp or email Hi-Life Furniture Rentals, or visit our showroom in Al Sajaa, Sharjah. ${site.phone}.`,
};

export default function ContactPage() {
  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact"
        title="Let's talk about your event"
        description="Call, message or visit our showroom in Sharjah. For prices and availability, send a quote request with your furniture list."
      />

      <div className="container-site grid gap-10 pb-24 lg:grid-cols-12 lg:gap-14 lg:pb-32">
        <div className="lg:col-span-5">
          <h2 className="sr-only">Contact details</h2>
          <ul className="space-y-3">
            <ContactRow
              href={site.phoneHref}
              icon={<PhoneIcon className="size-5" />}
              label="Call us"
              value={site.phone}
            />
            <ContactRow
              href={site.whatsappHref}
              external
              icon={<WhatsAppIcon className="size-5" />}
              label="WhatsApp"
              value={site.phone}
              hint="Chat with our team"
            />
            <ContactRow
              href={`mailto:${site.email}`}
              icon={<MailIcon className="size-5" />}
              label="Email"
              value={site.email}
            />
            <ContactRow
              href={site.mapsHref}
              external
              icon={<MapPinIcon className="size-5" />}
              label="Showroom"
              value={site.address}
              hint="Open in Google Maps"
            />
          </ul>

          <section aria-labelledby="hours-heading" className="mt-6 rounded-[1.5rem] bg-cream-100 p-6">
            <h2 id="hours-heading" className="flex items-center gap-2.5 text-h6 font-semibold text-forest-900">
              <ClockIcon className="size-5 text-copper-600" />
              Opening hours
            </h2>
            <dl className="mt-4 divide-y divide-forest-900/10 text-small">
              {site.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-stone">{row.days}</dt>
                  <dd className="font-medium text-forest-900">{row.time}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="quote-nudge-heading" className="mt-6 rounded-[1.5rem] bg-forest-900 p-6 text-cream-50 sm:p-7">
            <h2 id="quote-nudge-heading" className="text-h5 font-semibold text-cream-50">
              Need prices or availability?
            </h2>
            <p className="mt-2 text-small text-cream-50/70">
              Add the pieces you need to an enquiry and send your event details. We reply with a quote for your dates.
            </p>
            <ButtonLink href={quoteHref} variant="copper" size="md" className="mt-5">
              Request a Quote
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          </section>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[1.75rem] border border-forest-900/10 bg-white p-6 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}

/** One way to reach us: the whole row is the link */
function ContactRow({
  href,
  external = false,
  icon,
  label,
  value,
  hint,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center gap-4 rounded-[1.25rem] border border-forest-900/10 bg-white p-4 transition-colors hover:border-forest-900/30 sm:p-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-900 transition-colors group-hover:bg-forest-900 group-hover:text-cream-50">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.8125rem] text-stone">{label}</span>
          <span className="block font-semibold break-words text-forest-900">{value}</span>
          {hint && <span className="mt-0.5 block text-[0.8125rem] text-copper-700">{hint}</span>}
        </span>
        <ArrowUpRightIcon className="size-5 shrink-0 text-forest-900/40 transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-copper-600" />
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  );
}
