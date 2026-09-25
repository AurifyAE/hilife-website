import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { quoteHref, site } from "@/lib/site";

// DRAFT: terms for using the website only. Rentals themselves are covered by the agreement sent with each
// quote. Have this reviewed by the Hi-Life team or a legal adviser before launch, in particular the
// governing law section.

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use",
  description: "The terms for using the Hi-Life Furniture Rentals website and sending enquiries through it.",
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    content: (
      <p>
        These terms apply to your use of this website, run by {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By
        using the website you agree to them. They cover the website only: each furniture rental is covered by the
        rental agreement we send with your quote.
      </p>
    ),
  },
  {
    id: "using-the-site",
    title: "Using the website",
    content: (
      <>
        <p>You&apos;re welcome to browse the catalogue and send us enquiries. Please don&apos;t:</p>
        <ul>
          <li>use the website for anything unlawful, or send false or misleading enquiries;</li>
          <li>try to disrupt the website, get into parts of it you shouldn&apos;t, or send spam through its forms;</li>
          <li>copy the catalogue or its photos in bulk, by hand or with automated tools.</li>
        </ul>
      </>
    ),
  },
  {
    id: "furniture-information",
    title: "Furniture information",
    content: (
      <p>
        We work to keep product details accurate, but photos, colours and finishes can look different on screen, and
        dimensions are approximate. A piece shown on the website isn&apos;t guaranteed to be available for your
        dates until our team confirms it.
      </p>
    ),
  },
  {
    id: "quotes",
    title: "Enquiries, quotes and rentals",
    content: (
      <>
        <p>
          The website doesn&apos;t show prices or take payments. Sending a <Link href={quoteHref}>quote request</Link>{" "}
          or a message is an enquiry, not a booking.
        </p>
        <p>
          We&apos;ll reply with a quote for your pieces, dates and venue. A rental is only confirmed once you accept
          the quote and the rental agreement that comes with it, which sets out the prices, delivery, collection
          and responsibility for the furniture.
        </p>
      </>
    ),
  },
  {
    id: "your-details",
    title: "Your details",
    content: (
      <p>
        Please give accurate details when you contact us, so we can reply and quote correctly. How we handle your
        information is explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Our content",
    content: (
      <p>
        The website&apos;s text, photos, logo and design belong to {site.name} or the people who license them to us.
        You may view and share pages for your own event planning, but please don&apos;t reuse our content
        commercially without written permission.
      </p>
    ),
  },
  {
    id: "other-websites",
    title: "Other websites",
    content: (
      <p>
        Links to other services, such as WhatsApp and Google Maps, are there for convenience. We aren&apos;t
        responsible for their content or how they work.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility",
    content: (
      <p>
        We provide the website as it is and can&apos;t promise it will always be available or free of errors. As far
        as the law allows, we aren&apos;t responsible for losses caused by using or relying on the website. Nothing
        in these terms limits any responsibility that can&apos;t be limited by law.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    content: (
      <p>
        We may change the website or these terms at any time. The date at the top shows when the terms last changed,
        and the current version applies each time you use the website.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Sharjah, and
        any dispute will be handled by the courts of Sharjah.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms for using this website and sending us enquiries through it."
      updated="21 September 2026"
      sections={sections}
    />
  );
}
