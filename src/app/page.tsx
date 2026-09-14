import { AboutSection } from "@/components/home/about-section";
import { CollectionsSection } from "@/components/home/collections-section";
import { CtaSection } from "@/components/home/cta-section";
import { EventsSection } from "@/components/home/events-section";
import { Hero } from "@/components/home/hero";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <>
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
