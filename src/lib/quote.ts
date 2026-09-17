/** What the quote page needs to show a product in the enquiry summary */
export type QuoteProduct = {
  code: string;
  name: string;
  href: string;
  collection: string;
  /** Card photo URL, or null while the product has no photo */
  image: string | null;
  cutout: boolean;
};

export const customerTypes = [
  "Event agency",
  "Corporate company",
  "Hotel or venue",
  "Exhibition contractor",
  "Wedding or private event",
  "Other",
] as const;

export const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const ATTACHMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export type QuoteValues = {
  eventType: string | null;
  eventDate: string;
  emirate: string | null;
  venue: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  customerType: string | null;
  message: string;
  attachment: File | null;
};

export const emptyQuoteValues: QuoteValues = {
  eventType: null,
  eventDate: "",
  emirate: null,
  venue: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  customerType: null,
  message: "",
  attachment: null,
};

export type QuoteErrors = Partial<Record<keyof QuoteValues, string>>;

/** Form order, used to focus the first field with an error */
export const quoteFieldOrder: (keyof QuoteValues)[] = [
  "eventType",
  "eventDate",
  "emirate",
  "venue",
  "customerType",
  "name",
  "company",
  "email",
  "phone",
  "message",
  "attachment",
];

/** Today as yyyy-mm-dd in the visitor's time zone, to compare with a date input */
export function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function validateQuote(values: QuoteValues, itemCount: number): QuoteErrors {
  const errors: QuoteErrors = {};
  const text = (value: string) => value.trim();

  if (!values.eventType) errors.eventType = "Choose the type of event";
  if (!values.eventDate) errors.eventDate = "Enter the event date";
  else if (values.eventDate < localToday()) errors.eventDate = "The event date can't be in the past";
  if (!values.emirate) errors.emirate = "Choose the emirate";
  if (!values.customerType) errors.customerType = "Choose what describes you best";
  if (text(values.name).length < 2) errors.name = "Enter your name";
  if (!text(values.company)) errors.company = "Enter your company name";
  if (!text(values.email)) errors.email = "Enter your email address";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text(values.email))) errors.email = "Enter a valid email address";
  const digits = values.phone.replace(/[\s()+-]/g, "");
  if (!digits) errors.phone = "Enter your phone number";
  else if (!/^\d{7,15}$/.test(digits)) errors.phone = "Enter a valid phone number";
  if (itemCount === 0 && !text(values.message)) {
    errors.message = "Your enquiry list is empty, so tell us what furniture you need";
  }
  if (values.attachment) {
    if (!ATTACHMENT_TYPES.includes(values.attachment.type)) errors.attachment = "Attach a PDF, JPG or PNG file";
    else if (values.attachment.size > ATTACHMENT_MAX_BYTES) errors.attachment = "The file must be 10 MB or smaller";
  }
  return errors;
}

export type QuoteItem = { code: string; name: string; quantity: number };

/**
 * Sends the request to the lead backend as multipart form data (so the attachment travels with it).
 * The site is a static export, so the endpoint lives outside Next.js and is set at build time.
 */
export async function sendQuoteRequest(values: QuoteValues, items: QuoteItem[]) {
  const body = new FormData();
  body.set("source", "Quote form");
  for (const key of quoteFieldOrder) {
    const value = values[key];
    if (value instanceof File) body.set(key, value);
    else if (value) body.set(key, typeof value === "string" ? value.trim() : value);
  }
  body.set("items", JSON.stringify(items));

  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT;
  if (!endpoint) {
    if (process.env.NODE_ENV === "development") {
      // No backend yet: pretend it worked so the flow can be tried out locally
      console.info("Quote request (not sent, no NEXT_PUBLIC_QUOTE_ENDPOINT)", Object.fromEntries(body));
      await new Promise((resolve) => setTimeout(resolve, 900));
      return;
    }
    throw new Error("Quote endpoint is not configured");
  }

  const response = await fetch(endpoint, { method: "POST", body });
  if (!response.ok) throw new Error(`Quote request failed with ${response.status}`);
}
