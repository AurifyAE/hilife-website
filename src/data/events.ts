import type { StaticImageData } from "next/image";
import temporaryOffices from "@/assets/photos/collections/office-chairs.webp";
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
  /** Slugs of the collections that suit this kind of event (src/data/collections.ts) */
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
    collections: ["office-chairs", "sofas", "tables"],
    image: corporateEvents,
    focus: "40% 50%",
  },
  {
    slug: "weddings",
    name: "Weddings & celebrations",
    description: "Elegant lounges, dining chairs and décor for weddings, engagements and private parties.",
    collections: ["chairs", "arm-chairs", "accessories-appliances"],
    image: weddings,
    focus: "25% 60%",
  },
  {
    slug: "exhibitions",
    name: "Exhibitions",
    description: "Stand furniture, bar stools and display pieces delivered to your hall on schedule.",
    collections: ["bar-stools", "pouffes", "accessories-appliances"],
    image: exhibitions,
    focus: "50% 50%",
  },
  {
    slug: "brand-activations",
    name: "Brand activations",
    description: "Bold, photogenic setups for pop-ups, retail activations and experiential marketing.",
    collections: ["arm-chairs", "pouffes", "tables"],
    image: brandActivations,
    focus: "55% 50%",
  },
  {
    slug: "fit-out-projects",
    name: "Fit-out projects",
    description: "Project-based furniture for offices, show units and hospitality spaces.",
    collections: ["office-chairs", "sofas", "furniture-sets"],
    image: fitOutProjects,
    focus: "40% 65%",
  },
  {
    slug: "outdoor-events",
    name: "Outdoor events",
    description: "Outdoor lounges, umbrellas and dining sets for gardens, terraces and courtyards.",
    collections: ["furniture-sets", "sofas", "accessories-appliances"],
    image: outdoorEvents,
    focus: "50% 70%",
  },
  {
    slug: "temporary-offices",
    name: "Temporary offices",
    description: "Desks, meeting tables and office chairs for project sites, site offices and short-term teams.",
    collections: ["office-chairs", "tables", "sofas"],
    // SAMPLE PHOTO: shared with the Office Chairs collection until a real site-office photo is available
    image: temporaryOffices,
    focus: "60% 50%",
  },
];

export function getEventType(slug: string) {
  return eventTypes.find((event) => event.slug === slug);
}
