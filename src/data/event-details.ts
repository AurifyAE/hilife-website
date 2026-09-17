// SAMPLE COPY: written as a starting point. Have the Hi-Life team check every line before launch,
// and add facts (lead times, minimum orders, set-up crews) only once they are confirmed.

export type Faq = { question: string; answer: string };

export type EventDetails = {
  /** Large intro line under the page title */
  headline: string;
  intro: string;
  /** What Hi-Life takes care of for this kind of event */
  highlights: { title: string; text: string }[];
  faqs: Faq[];
  /** Reference codes shown under "Popular pieces", in order */
  featured: string[];
};

export const eventDetails: Record<string, EventDetails> = {
  "corporate-events-and-exhibitions": {
    headline: "Seating, lounges and stand furniture for conferences, launches and trade shows.",
    intro:
      "From a two-day conference to an exhibition stand, we supply the furniture guests use all day: seating for sessions, networking lounges, high tables for conversations and dining for gala dinners. Tell us the venue, dates and build times, and we plan delivery and collection around them.",
    highlights: [
      { title: "Zones for every part of the day", text: "Session seating, breakout areas, VIP lounges and dining can all come from one list." },
      { title: "Stands and hospitality areas", text: "Bar stools, high tables, pouffes and lounge seating for meetings on the stand." },
      { title: "Built around the schedule", text: "Share your floor plan, build and breakdown times, and we plan delivery and collection around them." },
    ],
    faqs: [
      { question: "What should we include in the enquiry?", answer: "The venue, the event or show dates, build and breakdown times if it's an exhibition, and the pieces you need. A floor plan or stand plan helps, and you can attach it to the form." },
      { question: "Can you furnish several areas or stands?", answer: "Yes. Add everything to one enquiry and note the areas in your notes, such as the main hall, a VIP lounge or each stand number." },
      { question: "Do you work with agencies and exhibition contractors?", answer: "Yes. Choose Event agency or Exhibition contractor in the form and add your client's details in the notes." },
      { question: "Can we match our brand colours?", answer: "Use the colour filter in the catalogue to find pieces in your colours, or describe your theme in the quote form and we'll suggest options." },
    ],
    featured: ["HLR-TB010BK", "HLR-MBT0005WT", "HLR-VIP0006GY", "HLR-CRS0007BK", "HLR-DSC0006BK", "HLR-RBT0010", "HLR-PF0001WT", "HLR-BH0001ST"],
  },
  weddings: {
    headline: "Lounges, dining chairs and details for a day that looks exactly as planned.",
    intro:
      "Weddings, engagements and private celebrations need furniture that fits the theme and holds up to a long evening. Build your list from our chairs, lounge pieces and accessories, and we'll check it against your date.",
    highlights: [
      { title: "Styled to your theme", text: "Choose finishes and colours that sit with your flowers, lighting and décor." },
      { title: "Lounges and dining in one order", text: "Guest dining, family seating and relaxed lounge corners from a single list." },
      { title: "Indoor or outdoor", text: "Ballrooms, gardens and beach venues, with outdoor-ready pieces where you need them." },
    ],
    faqs: [
      { question: "Can our wedding planner send the enquiry?", answer: "Of course. Planners can send the list and event details directly, and we'll reply to them with the quote." },
      { question: "Can we mix indoor and outdoor pieces?", answer: "Yes. Add both to your enquiry and tell us which areas are outdoors, so we can confirm the right pieces for each." },
      { question: "Can we share a mood board?", answer: "Yes. Attach a mood board or floor plan to the quote form, and it helps us suggest pieces that match." },
    ],
    featured: ["HLR-BC0017BG", "HLR-SC00019CM", "HLR-GDC0040BG", "HLR-CAC0041", "HLR-LTS0039BG", "HLR-HC00020WT", "HLR-BRP0002BG", "HLR-ACL0001BK"],
  },
  "brand-activations": {
    headline: "Photogenic, on-brand setups for pop-ups and experiential campaigns.",
    intro:
      "Activations need to look good in person and on camera. Pick statement arm chairs, colourful pouffes and tables to build a space that fits the campaign, and we'll bring it to the location.",
    highlights: [
      { title: "Pieces that stand out", text: "Bold colours and distinctive shapes that photograph well." },
      { title: "Malls, streets and venues", text: "Tell us where the activation runs and we plan delivery for the location." },
      { title: "Short or multi-day runs", text: "One-day pop-ups or campaigns across several days and locations." },
    ],
    faqs: [
      { question: "Can we rent for an activation that moves between locations?", answer: "Describe the locations and dates in your notes and our team will come back to you with the options." },
      { question: "How do we choose colours for the campaign?", answer: "Use the colour filter in the catalogue, or attach your campaign mood board to the quote form." },
      { question: "Can an agency enquire for a client?", answer: "Yes. Choose Event agency in the form and add the client and campaign details in your notes." },
    ],
    featured: ["HLR-BAC0039GN", "HLR-OC0030GN", "HLR-WAC0044BU", "HLR-BOP0004BL", "HLR-BWP0003WB", "HLR-SB0002RD", "HLR-TS0013WT", "HLR-GPC0017"],
  },
  "outdoor-events": {
    headline: "Outdoor lounges and dining sets for gardens, terraces and courtyards.",
    intro:
      "Garden receptions, poolside parties and terrace lounges need pieces made for outdoor use. Choose rattan and rope-woven sets, outdoor sofas and umbrellas, and we'll check them against your date and venue.",
    highlights: [
      { title: "Made for outdoors", text: "Rattan, rope-woven and outdoor-ready pieces for open-air venues." },
      { title: "Shade and comfort", text: "Umbrellas and lounge sets so guests can settle in." },
      { title: "Gardens to rooftops", text: "Tell us about the venue and access, and we plan the delivery around it." },
    ],
    faqs: [
      { question: "How do I find outdoor furniture in the catalogue?", answer: "Use the Setting filter in the catalogue and choose Outdoor to see pieces suited to open-air venues." },
      { question: "Can we mix outdoor and indoor areas?", answer: "Yes. Add pieces for both areas to one enquiry and mention which areas are outdoors in your notes." },
      { question: "What should we tell you about the venue?", answer: "The location, the area you're furnishing and anything about access, such as stairs, sand or long walks from the loading point." },
    ],
    featured: ["HLR-ORS0052BR", "HLR-MOS0051", "HLR-FGD0004WB", "HLR-RWO0036BG", "HLR-RCC0045BR", "HLR-RRT0013BR", "HLR-ORT0028BR", "HLR-OPU0001CR"],
  },
  "temporary-offices": {
    headline: "Office chairs, desks and meeting tables for teams that need a space fast.",
    intro:
      "Project sites, site offices, interim headquarters and short-term teams all need somewhere to work. Rent office chairs, tables and soft seating for as long as the project runs.",
    highlights: [
      { title: "Workstations and meeting rooms", text: "Task chairs, executive chairs and tables for desks and meetings." },
      { title: "Breakout and waiting areas", text: "Sofas and lounge pieces for reception and break areas." },
      { title: "Rent for the project", text: "Tell us how long you need the space furnished and we quote for that period." },
    ],
    faqs: [
      { question: "Can we rent office furniture for a few months?", answer: "Yes. Give the start date as the event date and mention how long you need the furniture in your notes." },
      { question: "Do you furnish site offices?", answer: "Yes. Tell us where the site is and about access, and we'll plan the delivery." },
      { question: "Can we add more furniture as the team grows?", answer: "Send a new enquiry when you need more, and mention your existing rental so our team can link them." },
    ],
    featured: ["HLR-SOC0001BG", "HLR-DSC0006BK", "HLR-MOC0008B", "HLR-WLC0005WT", "HLR-RDT0009", "HLR-FS0005BK", "HLR-SR0001BK", "HLR-WD0001"],
  },
};

/** Shared questions for the Events hub */
export const generalFaqs: Faq[] = [
  { question: "Do you show prices on the website?", answer: "No. Every event is different, so we quote for your pieces, dates and venue. Add what you need to an enquiry and our team replies with a quote." },
  { question: "Which areas do you deliver to?", answer: "We deliver across the UAE. Choose your emirate and venue in the quote form." },
  { question: "What happens after I send an enquiry?", answer: "Our team checks availability for your dates and gets back to you with a quote by email or phone." },
  { question: "Can I request something that isn't in the catalogue?", answer: "Yes. Describe what you need in the quote form and we'll let you know what we can offer." },
  { question: "Can I change my list after sending it?", answer: "Yes. Reply to our team or call us, and we'll update the quote." },
];

/** "How it works" steps, shared by the Events hub and every event page */
export const processSteps = [
  { title: "Build your list", text: "Browse the catalogue and add the pieces you need, or describe them in the quote form." },
  { title: "Share your event", text: "Tell us the date, emirate and venue, and attach a floor plan or mood board if you have one." },
  { title: "Get your quote", text: "Our team checks availability for your dates and replies with a quote." },
  { title: "We deliver and collect", text: "Once you confirm, we deliver before your event and collect afterwards." },
];
