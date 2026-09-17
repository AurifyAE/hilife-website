import type { Metadata } from "next";
import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { CtaSection } from "@/components/home/cta-section";
import { PortfolioBrowser } from "@/components/portfolio/portfolio-browser";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Photos of Hi-Life rental furniture set up at corporate events, exhibitions, weddings, brand activations and outdoor events across the UAE.",
};

export default function PortfolioPage() {
  return (
    <>
      <CatalogueHeader
        crumbs={[{ label: "Portfolio" }]}
        eyebrow="Portfolio"
        title="Spaces we've set up"
        description="See how our furniture comes together at real venues. Filter by event type, and open any photo to see it full size."
      />
      <div className="container-site pb-8">
        <PortfolioBrowser />
      </div>
      <CtaSection />
    </>
  );
}
