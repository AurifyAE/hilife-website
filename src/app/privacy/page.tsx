import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

// DRAFT: describes what the website actually does today (forms, the enquiry list kept on the device,
// no tracking cookies). Have it reviewed by the Hi-Life team or a legal adviser before launch, and
// update it when the lead admin, WhatsApp alerts or analytics go live.

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How Hi-Life Furniture Rentals collects, uses and protects the details you share through this website.",
};

const email = <a href={`mailto:${site.email}`}>{site.email}</a>;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <p>
        This website is run by {site.name}, based at {site.address}. In this policy, &ldquo;we&rdquo; and
        &ldquo;us&rdquo; mean {site.name}. If you have a question about your personal information, email {email}.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    content: (
      <>
        <p>We only collect the details you choose to send us:</p>
        <ul>
          <li>
            <strong>Quote requests:</strong> your name, company, email, phone number, the type of customer you are,
            your event type, date, emirate and venue, the furniture and quantities on your list, any notes, and any
            floor plan or mood board you attach.
          </li>
          <li>
            <strong>Contact messages:</strong> your name, email, message and, if you add them, your company and
            phone number.
          </li>
          <li>
            <strong>Technical information:</strong> like any website, our hosting provider records basic
            information such as your IP address, browser type and the pages requested, to keep the site running and
            secure.
          </li>
        </ul>
        <p>We don&apos;t ask for payment details, and you don&apos;t need an account to use the website.</p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    content: (
      <>
        <ul>
          <li>To reply to your enquiry, check availability and send you a quote.</li>
          <li>To plan delivery and collection if you go ahead with a rental.</li>
          <li>To keep a record of enquiries so our team can follow up and answer questions later.</li>
          <li>To keep the website secure and working properly.</li>
        </ul>
        <p>
          We don&apos;t sell your information, and we don&apos;t add you to marketing lists without asking you
          first.
        </p>
      </>
    ),
  },
  {
    id: "enquiry-list",
    title: "Your enquiry list",
    content: (
      <p>
        The pieces you add to your enquiry are saved in your own browser (local storage), so your list is still there
        when you come back. It stays on your device and isn&apos;t sent to us until you submit a quote request. You
        can remove items at any time, and the list is cleared once your request is sent or when you clear your
        browser data.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        We don&apos;t use advertising or analytics cookies. The only information the website stores on your device
        is your enquiry list, described above. If we add analytics in the future, we&apos;ll update this policy and
        ask for your consent where it&apos;s needed.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>Your information is seen by our own team. We also use trusted service providers who help us run the website and handle enquiries, such as:</p>
        <ul>
          <li>the company that hosts this website;</li>
          <li>the service that stores enquiries and any files you attach;</li>
          <li>the messaging service that alerts our team to new enquiries.</li>
        </ul>
        <p>
          They may only use your information to provide their service to us. We&apos;ll also share information if
          the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <p>
        We keep enquiry details for as long as we need them to handle your request and any rental that follows, and
        to meet our legal and accounting obligations. After that, we delete them or make them anonymous.
      </p>
    ),
  },
  {
    id: "security",
    title: "Keeping it safe",
    content: (
      <p>
        The website uses an encrypted connection (HTTPS), and access to enquiries is limited to our team. No method
        of sending or storing information online is completely secure, but we take reasonable steps to protect what
        you share with us.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <p>
        Under UAE data protection law you can ask to see the personal information we hold about you, have it
        corrected or deleted, or object to how we use it. Email {email} and we&apos;ll reply as soon as we can.
      </p>
    ),
  },
  {
    id: "other-websites",
    title: "Other websites",
    content: (
      <p>
        Some links, such as WhatsApp and Google Maps, take you to other services. Their own privacy policies apply
        when you use them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. The date at the top shows when it last changed. You can also
        read our <Link href="/terms">Terms of Use</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use and protect the details you share with us through this website."
      updated="21 September 2026"
      sections={sections}
    />
  );
}
