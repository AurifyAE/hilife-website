const address = "Shed No. 13, Al Sajaa Industrial Area, Sharjah, UAE";

/**
 * Where the site will live. Used for the sitemap, canonical links and share previews, so set
 * NEXT_PUBLIC_SITE_URL to the real domain in the Cloudflare build settings before launch.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hi-life-rentals.pages.dev").replace(/\/$/, "");

export const site = {
  name: "Hi-Life Furniture Rentals",
  phone: "+971 54 306 5405",
  phoneHref: "tel:+971543065405",
  // WhatsApp uses the same number
  whatsappHref: "https://wa.me/971543065405",
  email: "info@palmcorneruae.ae",
  address,
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  // PLACEHOLDER HOURS: confirm with the Hi-Life team before launch
  hours: [
    { days: "Saturday to Thursday", time: "9:00 am – 6:00 pm" },
    { days: "Friday", time: "Closed" },
  ],
};

export const mainNav = [
  { label: "Furniture", href: "/furniture" },
  { label: "Events", href: "/events" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export const quoteHref = "/quote";
