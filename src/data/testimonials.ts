export type Testimonial = {
  quote: string;
  role: string;
  company: string;
  location: string;
  /** Shown in the avatar until client photos or logos are available */
  initials: string;
  /** Placeholder content: shows a "Sample testimonial" tag until replaced with a real, approved quote */
  sample: boolean;
};

// SAMPLE CONTENT: replace with real client quotes (with their permission) before launch
export const testimonials: Testimonial[] = [
  {
    quote:
      "The lounge setup arrived on time and looked exactly like our mood board. It made a two-day conference feel effortless.",
    role: "Head of Events",
    company: "Events agency",
    location: "Dubai",
    initials: "EA",
    sample: true,
  },
  {
    quote:
      "They understood the look we wanted straight away. Every chair and table was in place before the florists even arrived.",
    role: "Senior Wedding Planner",
    company: "Wedding planning studio",
    location: "Abu Dhabi",
    initials: "WP",
    sample: true,
  },
  {
    quote:
      "One enquiry covered everything, from bar stools to outdoor sets. Quick quotes, careful delivery and a smooth collection.",
    role: "Banquet Manager",
    company: "Hotel",
    location: "Sharjah",
    initials: "HT",
    sample: true,
  },
  {
    quote:
      "Our stand needed furniture on a tight build schedule. The team delivered to the hall and kept to every time slot.",
    role: "Project Manager",
    company: "Exhibition company",
    location: "Dubai",
    initials: "EX",
    sample: true,
  },
];
