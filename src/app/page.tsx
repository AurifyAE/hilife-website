import { AboutSection } from "@/components/home/about-section";
import { JsonLd } from "@/components/json-ld";
import { CollectionsSection } from "@/components/home/collections-section";
import { CtaSection } from "@/components/home/cta-section";
import { EventsSection } from "@/components/home/events-section";
import { Hero } from "@/components/home/hero";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { site, siteUrl } from "@/lib/site";

/** Tells search engines who we are, where we are and how to reach us */
const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description:
    "Rental furniture for corporate events, exhibitions, weddings, brand activations, outdoor events and temporary offices across the UAE.",
  url: siteUrl,
  image: `${siteUrl}/opengraph-image.jpg`,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shed No. 13, Al Sajaa Industrial Area",
    addressLocality: "Sharjah",
    addressCountry: "AE",
  },
  areaServed: { "@type": "Country", name: "United Arab Emirates" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={business} />
      <Hero />
      <CollectionsSection />
      <EventsSection />
      <PortfolioSection />
      <AboutSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
