import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to ./out, served by Cloudflare (see wrangler.jsonc).
  output: "export",
  images: {
    // The default image optimizer needs a Node server, which a static export doesn't have.
    unoptimized: true,
  },
};

export default nextConfig;
