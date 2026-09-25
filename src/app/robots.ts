import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Written out as a file at build time (the site is a static export)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The thank-you page is only meant to be seen after sending a request
    rules: { userAgent: "*", allow: "/", disallow: "/quote/thank-you" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
