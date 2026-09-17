import type { StaticImageData } from "next/image";
import sample01 from "@/assets/photos/portfolio/sample-01.webp";
import sample02 from "@/assets/photos/portfolio/sample-02.webp";
import sample03 from "@/assets/photos/portfolio/sample-03.webp";
import sample04 from "@/assets/photos/portfolio/sample-04.webp";
import sample05 from "@/assets/photos/portfolio/sample-05.webp";
import sample06 from "@/assets/photos/portfolio/sample-06.webp";
import sample07 from "@/assets/photos/portfolio/sample-07.webp";
import sample08 from "@/assets/photos/portfolio/sample-08.webp";
import sample09 from "@/assets/photos/portfolio/sample-09.webp";
import sample10 from "@/assets/photos/portfolio/sample-10.webp";
import sample11 from "@/assets/photos/portfolio/sample-11.webp";
import sample12 from "@/assets/photos/portfolio/sample-12.webp";
import sample13 from "@/assets/photos/portfolio/sample-13.webp";
import sample14 from "@/assets/photos/portfolio/sample-14.webp";
import sample15 from "@/assets/photos/portfolio/sample-15.webp";
import sample16 from "@/assets/photos/portfolio/sample-16.webp";
import sample17 from "@/assets/photos/portfolio/sample-17.webp";

export type PortfolioPhoto = {
  id: string;
  image: StaticImageData;
  /** Event type slug (src/data/events.ts), used for the filters and on event pages */
  event: string;
  alt: string;
  /** Crop in the gallery, e.g. "4/5". Leave out to show the photo in its own shape */
  aspect?: string;
  /** CSS object-position when the photo is cropped */
  focus?: string;
  /** Placeholder photo from the sample set, to be replaced with real Hi-Life setups */
  sample: boolean;
};

// SAMPLE PHOTOS: stock interiors with guessed event types. Replace with real Hi-Life setups before
// launch; newest first, since the homepage shows the first nine.
export const portfolioPhotos: PortfolioPhoto[] = [
  {
    id: "sample-01",
    image: sample01,
    event: "corporate-events-and-exhibitions",
    alt: "Lounge seating in an open-plan office",
    aspect: "4/5",
    focus: "30% 60%",
    sample: true,
  },
  {
    id: "sample-02",
    image: sample02,
    event: "temporary-offices",
    alt: "Leather chairs around a boardroom table",
    aspect: "4/3",
    sample: true,
  },
  {
    id: "sample-03",
    image: sample03,
    event: "outdoor-events",
    alt: "Outdoor lounge set on a garden terrace",
    aspect: "1/1",
    focus: "50% 60%",
    sample: true,
  },
  {
    id: "sample-04",
    image: sample04,
    event: "brand-activations",
    alt: "Mustard lounge chairs around a coffee table",
    aspect: "3/4",
    focus: "70% 60%",
    sample: true,
  },
  {
    id: "sample-05",
    image: sample05,
    event: "temporary-offices",
    alt: "Office chairs at a shared desk",
    aspect: "4/3",
    sample: true,
  },
  {
    id: "sample-06",
    image: sample06,
    event: "weddings",
    alt: "Timber arm chair with a woven back",
    aspect: "4/5",
    focus: "45% 50%",
    sample: true,
  },
  {
    id: "sample-07",
    image: sample07,
    event: "brand-activations",
    alt: "Yellow accent chair in a styled corner",
    aspect: "1/1",
    focus: "40% 60%",
    sample: true,
  },
  {
    id: "sample-08",
    image: sample08,
    event: "weddings",
    alt: "Tan sofa styled with dried pampas",
    aspect: "3/4",
    focus: "45% 60%",
    sample: true,
  },
  {
    id: "sample-09",
    image: sample09,
    event: "corporate-events-and-exhibitions",
    alt: "Sage green swivel chairs",
    aspect: "4/3",
    sample: true,
  },
  {
    id: "sample-10",
    image: sample10,
    event: "corporate-events-and-exhibitions",
    alt: "Green meeting chair beside a desk",
    aspect: "4/5",
    focus: "55% 50%",
    sample: true,
  },
  {
    id: "sample-11",
    image: sample11,
    event: "weddings",
    alt: "Cream sofa and round coffee table",
    aspect: "4/3",
    sample: true,
  },
  {
    id: "sample-12",
    image: sample12,
    event: "corporate-events-and-exhibitions",
    alt: "Lounge with a grey sofa and leather pouffes",
    aspect: "1/1",
    focus: "45% 60%",
    sample: true,
  },
  {
    id: "sample-13",
    image: sample13,
    event: "temporary-offices",
    alt: "Charcoal corner sofa with nesting tables",
    aspect: "4/5",
    focus: "35% 60%",
    sample: true,
  },
  {
    id: "sample-14",
    image: sample14,
    event: "corporate-events-and-exhibitions",
    alt: "Leather sofa in a low-lit lounge",
    aspect: "4/3",
    sample: true,
  },
  {
    id: "sample-15",
    image: sample15,
    event: "corporate-events-and-exhibitions",
    alt: "High tables and bar stools in a networking area",
    aspect: "3/4",
    focus: "45% 60%",
    sample: true,
  },
  {
    id: "sample-16",
    image: sample16,
    event: "weddings",
    alt: "Accent chair beside a cream sideboard",
    aspect: "4/5",
    focus: "30% 60%",
    sample: true,
  },
  {
    id: "sample-17",
    image: sample17,
    event: "brand-activations",
    alt: "Timber bar stools at a café counter",
    aspect: "4/3",
    sample: true,
  },
];

export function photosForEvent(slug: string) {
  return portfolioPhotos.filter((photo) => photo.event === slug);
}
