import type { StaticImageData } from "next/image";
import brandActivations from "@/assets/photos/events/brand-activations.webp";
import corporateEvents from "@/assets/photos/events/corporate-events.webp";
import exhibitions from "@/assets/photos/events/exhibitions.webp";
import fitOutProjects from "@/assets/photos/events/fit-out-projects.webp";
import outdoorEvents from "@/assets/photos/events/outdoor-events.webp";
import weddings from "@/assets/photos/events/weddings.webp";

export type EventType = {
  slug: string;
  name: string;
  description: string;
  /** Collections that suit this kind of event */
  collections: string[];
  image: StaticImageData;
  /** CSS object-position for the photo */
  focus: string;
};

export const eventTypes: EventType[] = [
  {
    slug: "corporate-events",
    name: "Corporate events",
    description: "Conferences, launches and gala dinners with seating, lounges and stage furniture.",
    collections: ["Office Chairs", "Sofas", "Tables"],
    image: corporateEvents,
    focus: "40% 50%",
  },
  {
    slug: "weddings",
    name: "Weddings & celebrations",
    description: "Elegant lounges, dining chairs and décor for weddings, engagements and private parties.",
    collections: ["Chairs", "Arm Chairs", "Accessories"],
    image: weddings,
    focus: "25% 60%",
  },
  {
    slug: "exhibitions",
    name: "Exhibitions",
    description: "Stand furniture, bar stools and display pieces delivered to your hall on schedule.",
    collections: ["Bar Stools", "Pouffes", "Accessories"],
    image: exhibitions,
    focus: "50% 50%",
  },
  {
    slug: "brand-activations",
    name: "Brand activations",
    description: "Bold, photogenic setups for pop-ups, retail activations and experiential marketing.",
    collections: ["Arm Chairs", "Pouffes", "Tables"],
    image: brandActivations,
    focus: "55% 50%",
  },
  {
    slug: "fit-out-projects",
    name: "Fit-out projects",
    description: "Project-based furniture for offices, show units and hospitality spaces.",
    collections: ["Office Chairs", "Sofas", "Furniture Sets"],
    image: fitOutProjects,
    focus: "40% 65%",
  },
  {
    slug: "outdoor-events",
    name: "Outdoor events",
    description: "Outdoor lounges, umbrellas and dining sets for gardens, terraces and courtyards.",
    collections: ["Furniture Sets", "Sofas", "Accessories"],
    image: outdoorEvents,
    focus: "50% 70%",
  },
];
