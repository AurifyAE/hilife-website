/** Brand statement from the Hi-Life rental catalogue; accent segments are set in copper italics */
export const brandStatement = [
  { text: "From empty space to", accent: false },
  { text: "unforgettable place.", accent: true },
  {
    text: "Great events are remembered for how they feel. We bring the furniture, the flexibility and the expertise to turn your vision into a space worth remembering.",
    accent: false,
  },
];

export type GroupCompany = {
  /** Small label above the name; leave out to show none */
  role?: string;
  name: string;
  description: string;
  current?: boolean;
};

// PLACEHOLDER descriptions: confirm them with the Hi-Life team before launch
export const groupCompanies: GroupCompany[] = [
  {
    role: "Our group",
    name: "Hi-Life Group",
    description: "The group Hi-Life Furniture Rentals belongs to.",
  },
  {
    role: "This company",
    name: "Hi-Life Furniture Rentals",
    description: "Rental furniture for events, exhibitions and temporary offices across the UAE.",
    current: true,
  },
  {
    name: "VK Exhibitions & Decor Industry LLC",
    description: "Exhibition stands and décor, working alongside Hi-Life on shows and events.",
  },
];
