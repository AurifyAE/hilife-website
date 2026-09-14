import type { StaticImageData } from "next/image";
import gardenWeddingLounge from "@/assets/photos/portfolio/garden-wedding-lounge.webp";
import showApartmentFitOut from "@/assets/photos/portfolio/show-apartment-fit-out.webp";
import summitNetworkingLounge from "@/assets/photos/portfolio/summit-networking-lounge.webp";

export type ProjectStat = {
  value: number;
  /** Shown after the number, e.g. " days" */
  unit?: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  eventType: string;
  summary: string;
  stats: ProjectStat[];
  collections: string[];
  image: StaticImageData;
  focus: string;
  /** Placeholder content: shows a "Sample project" tag until replaced with a real project */
  sample: boolean;
};

// SAMPLE CONTENT: replace titles, numbers and photos with real Hi-Life projects before launch
export const featuredProjects: Project[] = [
  {
    slug: "summit-networking-lounge",
    title: "Networking lounge for a tech summit",
    location: "Dubai",
    eventType: "Conference",
    summary:
      "High tables, bar stools and soft seating zones that kept two days of networking moving between sessions.",
    stats: [
      { value: 180, label: "Pieces supplied" },
      { value: 2, unit: " days", label: "Event length" },
      { value: 1200, label: "Guests" },
    ],
    collections: ["Bar Stools", "Tables", "Pouffes"],
    image: summitNetworkingLounge,
    focus: "30% 60%",
    sample: true,
  },
  {
    slug: "garden-wedding-lounge",
    title: "Garden wedding reception lounge",
    location: "Abu Dhabi",
    eventType: "Wedding",
    summary:
      "Warm timber arm chairs and cream upholstery arranged into relaxed lounge corners around the dance floor.",
    stats: [
      { value: 120, label: "Pieces supplied" },
      { value: 1, unit: " day", label: "Setup time" },
      { value: 300, label: "Guests" },
    ],
    collections: ["Arm Chairs", "Sofas", "Tables"],
    image: gardenWeddingLounge,
    focus: "55% 60%",
    sample: true,
  },
  {
    slug: "show-apartment-fit-out",
    title: "Show apartment fit-out",
    location: "Sharjah",
    eventType: "Fit-out project",
    summary:
      "A complete furnished look for two show units, delivered, styled and collected at the end of the sales launch.",
    stats: [
      { value: 45, label: "Pieces supplied" },
      { value: 6, unit: " weeks", label: "Rental period" },
      { value: 2, label: "Units furnished" },
    ],
    collections: ["Sofas", "Tables", "Accessories"],
    image: showApartmentFitOut,
    focus: "50% 70%",
    sample: true,
  },
];
