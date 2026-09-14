import type { StaticImageData } from "next/image";
import accessoriesAppliances from "@/assets/photos/collections/accessories-appliances.webp";
import armChairs from "@/assets/photos/collections/arm-chairs.webp";
import barStools from "@/assets/photos/collections/bar-stools.webp";
import chairs from "@/assets/photos/collections/chairs.webp";
import furnitureSets from "@/assets/photos/collections/furniture-sets.webp";
import officeChairs from "@/assets/photos/collections/office-chairs.webp";
import pouffes from "@/assets/photos/collections/pouffes.webp";
import sofas from "@/assets/photos/collections/sofas.webp";
import tables from "@/assets/photos/collections/tables.webp";

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: StaticImageData;
  /** CSS object-position that keeps the furniture in frame when the photo is cropped */
  focus: string;
};

export const collections: Collection[] = [
  {
    slug: "chairs",
    name: "Chairs",
    description: "Dining, banquet and accent chairs for seated events of any size.",
    image: chairs,
    focus: "74% 60%",
  },
  {
    slug: "arm-chairs",
    name: "Arm Chairs",
    description: "Upholstered arm chairs for lounges, VIP areas and stage seating.",
    image: armChairs,
    focus: "50% 65%",
  },
  {
    slug: "bar-stools",
    name: "Bar Stools",
    description: "Counter and high-bar stools for cocktail bars and networking zones.",
    image: barStools,
    focus: "28% 60%",
  },
  {
    slug: "office-chairs",
    name: "Office Chairs",
    description: "Executive and task chairs for conferences and temporary offices.",
    image: officeChairs,
    focus: "70% 50%",
  },
  {
    slug: "sofas",
    name: "Sofas",
    description: "Indoor and outdoor sofas to build comfortable lounge settings.",
    image: sofas,
    focus: "62% 60%",
  },
  {
    slug: "pouffes",
    name: "Pouffes",
    description: "Soft pouffes for relaxed, flexible seating and exhibition zones.",
    image: pouffes,
    focus: "50% 88%",
  },
  {
    slug: "furniture-sets",
    name: "Furniture Sets",
    description: "Coordinated lounge, dining and majlis sets, ready to place.",
    image: furnitureSets,
    focus: "55% 60%",
  },
  {
    slug: "tables",
    name: "Tables",
    description: "Cocktail, coffee, dining and side tables in every finish.",
    image: tables,
    focus: "50% 72%",
  },
  {
    slug: "accessories-appliances",
    name: "Accessories & Appliances",
    description: "Umbrellas, fridges, display stands and the details that finish a space.",
    image: accessoriesAppliances,
    focus: "55% 45%",
  },
];
