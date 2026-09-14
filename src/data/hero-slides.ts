import type { StaticImageData } from "next/image";
import livingRoom from "@/assets/photos/hero/living-room.jpg";
import loungeSpace from "@/assets/photos/hero/lounge-space.jpg";

export type HeroSlide = {
  id: string;
  image: StaticImageData;
  alt: string;
  /** Each entry renders on its own line */
  headline: string[];
  /** CSS object-position for the background photo */
  focus: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "mood",
    image: livingRoom,
    alt: "Living room with a grey sofa, leather pouffes, a timber coffee table and a brass arc lamp",
    headline: ["Furniture", "that sets", "the mood."],
    focus: "50% 60%",
  },
  {
    id: "moment",
    image: loungeSpace,
    alt: "Open-plan office lounge with a curved sofa, swivel armchairs and a round coffee table",
    headline: ["Spaces", "that make", "the moment."],
    focus: "30% 70%",
  },
];
