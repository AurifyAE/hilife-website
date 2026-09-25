import type { Metadata } from "next";
import Image from "next/image";
import livingRoom from "@/assets/photos/hero/living-room.webp";
import { HighlightStatement } from "@/components/about/highlight-statement";
import { Breadcrumbs } from "@/components/catalogue/catalogue-header";
import { ProcessSteps } from "@/components/events/process-steps";
import { CtaSection } from "@/components/home/cta-section";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { brandStatement, groupCompanies } from "@/data/about";
import { cx } from "@/lib/cx";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Hi-Life Furniture Rentals supplies rental furniture for corporate events, exhibitions, weddings and temporary offices across the UAE, from Al Sajaa, Sharjah.",
};

export default function AboutPage() {
  return (
    <>
      <header className="container-site pt-32 pb-16 lg:pt-40 lg:pb-24">
        <Breadcrumbs items={[{ label: "About" }]} />
        <h1 className="eyebrow mt-8 text-copper-600">About Hi-Life</h1>
        <HighlightStatement segments={brandStatement} className="mt-6 max-w-[62rem] text-forest-900" />
      </header>

      <section aria-labelledby="who-heading" className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow text-copper-600">Who we are</p>
            <h2 id="who-heading" className="mt-4 text-h2 text-forest-900">
              Rental furniture for events across the UAE
            </h2>
            <div className="mt-6 space-y-4 text-stone">
              <p>
                Hi-Life Furniture Rentals supplies furniture for corporate events and exhibitions, weddings, brand
                activations, outdoor events and temporary offices. From a single lounge to a full venue, you choose
                the pieces and we bring them to you.
              </p>
              <p>
                We&apos;re based in Al Sajaa Industrial Area, Sharjah. Every enquiry is handled by our own team: we
                check availability for your dates, send you a quote and plan delivery and collection around your
                venue.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/furniture" variant="forest" size="md">
                Browse furniture
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline-dark" size="md">
                Contact us
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="shape-brand relative aspect-[4/3] overflow-hidden bg-forest-900">
              <Image
                src={livingRoom}
                alt="A lounge furnished with a grey sofa, leather pouffes and a timber coffee table"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="group-heading" className="container-site section-y">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-600">Our group</p>
          <h2 id="group-heading" className="mt-4 text-h2 text-forest-900">
            Part of a wider family of companies
          </h2>
          <p className="mt-5 text-lead text-stone">
            Hi-Life works alongside businesses in exhibitions and events, so one call can cover more of your
            project.
          </p>
        </div>
        <ul className="mt-10 grid gap-3 md:grid-cols-3">
          {groupCompanies.map((company) => (
            <li
              key={company.name}
              className={cx(
                "flex flex-col gap-6 rounded-[1.5rem] p-6 sm:p-7",
                company.current ? "bg-forest-900 text-cream-50" : "border border-forest-900/10 bg-white",
              )}
            >
              {company.role && (
                <span className={cx("eyebrow", company.current ? "text-copper-300" : "text-copper-600")}>
                  {company.role}
                </span>
              )}
              <div className="mt-auto">
                {/* Text marks until the company logos are supplied */}
                <p className={cx("text-h5 font-semibold", company.current ? "text-cream-50" : "text-forest-900")}>
                  {company.name}
                </p>
                <p className={cx("mt-2 text-small", company.current ? "text-cream-50/70" : "text-stone")}>
                  {company.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ProcessSteps title="How we work with you" />
      <CtaSection />
    </>
  );
}
