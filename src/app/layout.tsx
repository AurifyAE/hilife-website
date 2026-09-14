import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hi-Life Furniture Rentals | Event Furniture Rental in the UAE",
    template: "%s | Hi-Life Furniture Rentals",
  },
  description:
    "Premium rental furniture for corporate events, weddings, exhibitions and hospitality, delivered across the UAE.",
};

export const viewport: Viewport = {
  themeColor: "#1f4a3b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-forest-900 focus:px-5 focus:py-3 focus:text-cream-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
