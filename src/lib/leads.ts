/**
 * Sends a lead (a quote request or a contact message) to the lead backend as multipart form data,
 * so attachments travel with it. The site is a static export, so the endpoint lives outside
 * Next.js and is set at build time with NEXT_PUBLIC_LEADS_ENDPOINT.
 */
export async function sendLead(body: FormData) {
  const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;
  if (!endpoint) {
    if (process.env.NODE_ENV === "development") {
      // No backend yet: pretend it worked so the flow can be tried out locally
      console.info("Lead (not sent, no NEXT_PUBLIC_LEADS_ENDPOINT)", Object.fromEntries(body));
      await new Promise((resolve) => setTimeout(resolve, 900));
      return;
    }
    throw new Error("Leads endpoint is not configured");
  }

  const response = await fetch(endpoint, { method: "POST", body });
  if (!response.ok) throw new Error(`Lead request failed with ${response.status}`);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** 7 to 15 digits once spaces, brackets, dashes and a leading + are ignored */
export function isValidPhone(value: string) {
  return /^\d{7,15}$/.test(value.replace(/[\s()+-]/g, ""));
}
