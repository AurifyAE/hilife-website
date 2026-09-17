"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { AlertIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import { EnquirySummary, type EnquiryLine } from "@/components/quote/enquiry-summary";
import { ChoiceGroup, describedBy, Field, FileField, inputClass } from "@/components/quote/form-fields";
import { Select } from "@/components/ui/select";
import { cx } from "@/lib/cx";
import { addToEnquiry, clearEnquiry, useEnquiry } from "@/lib/enquiry";
import { getLenis } from "@/lib/lenis";
import {
  ATTACHMENT_TYPES,
  customerTypes,
  emirates,
  emptyQuoteValues,
  localToday,
  quoteFieldOrder,
  sendQuoteRequest,
  validateQuote,
  type QuoteProduct,
  type QuoteValues,
} from "@/lib/quote";
import { site } from "@/lib/site";

const noopSubscribe = () => () => {};

/** Every field's id, so labels, errors and focus-on-error line up */
const fieldId = (key: keyof QuoteValues) => `quote-${key}`;

/** Drops a link parameter from the address bar so a reload doesn't apply it again */
function removeSearchParam(name: string) {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(name)) return;
  params.delete(name);
  const search = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
}

function focusField(key: keyof QuoteValues) {
  const element = document.getElementById(fieldId(key));
  if (!element) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(element, { offset: -160 });
  else element.scrollIntoView({ block: "center" });
  element.focus({ preventScroll: true });
}

type Props = {
  catalogue: QuoteProduct[];
  /** Event types for the dropdown; ?event=slug preselects one */
  events: { slug: string; name: string }[];
};

export function QuoteRequest({ catalogue, events }: Props) {
  const eventTypeOptions = [...events.map((event) => event.name), "Other"];
  const router = useRouter();
  const enquiry = useEnquiry();
  // The list lives in localStorage, so the server render can't know it: show a placeholder until hydrated
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const today = useSyncExternalStore(noopSubscribe, localToday, () => undefined);

  const byCode = useMemo(() => new Map(catalogue.map((product) => [product.code, product])), [catalogue]);
  const lines: EnquiryLine[] = enquiry.flatMap((item) => {
    const product = byCode.get(item.code);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

  const [values, setValues] = useState<QuoteValues>(emptyQuoteValues);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  // Keeps the sent list on screen while the thank-you page loads, after the stored list is cleared
  const [sentLines, setSentLines] = useState<EnquiryLine[] | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const shownLines = sentLines ?? lines;
  const errors = attempted && !sentLines ? validateQuote(values, shownLines.length) : {};
  const errorCount = Object.keys(errors).length;

  const set = <K extends keyof QuoteValues>(key: K, value: QuoteValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  // Event pages link here with ?event=slug: preselect that event type (once, and never over a choice)
  const linkedEventSlug = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("event"),
    () => null,
  );
  const [appliedEventSlug, setAppliedEventSlug] = useState<string | null>(null);
  if (linkedEventSlug && linkedEventSlug !== appliedEventSlug) {
    setAppliedEventSlug(linkedEventSlug);
    const linkedEvent = events.find((event) => event.slug === linkedEventSlug);
    if (linkedEvent && !values.eventType) setValues({ ...values, eventType: linkedEvent.name });
  }

  // ?product=CODE ("Ask about availability" on a product page) puts the product on the list
  const addLinkedProduct = useEffectEvent(() => {
    const code = new URLSearchParams(window.location.search).get("product");
    if (!code) return;
    if (byCode.has(code) && !enquiry.some((item) => item.code === code)) addToEnquiry(code);
    removeSearchParam("product");
  });
  useEffect(() => addLinkedProduct(), []);

  // Remove ?event= only once it has been applied: the render that reads it runs after mount effects
  useEffect(() => {
    if (appliedEventSlug) removeSearchParam("event");
  }, [appliedEventSlug]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || sentLines) return;

    setAttempted(true);
    const found = validateQuote(values, lines.length);
    const firstInvalid = quoteFieldOrder.find((key) => found[key]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    const finish = () => {
      setSentLines(lines);
      clearEnquiry();
      router.push("/quote/thank-you");
    };

    // Bots fill in the hidden field: act as if it worked without sending anything
    if (honeypotRef.current?.value) {
      finish();
      return;
    }

    setStatus("sending");
    try {
      await sendQuoteRequest(
        values,
        lines.map((line) => ({ code: line.product.code, name: line.product.name, quantity: line.quantity })),
      );
      finish();
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending" || sentLines !== null;
  const listEmpty = ready && shownLines.length === 0;
  const messageHint = "Guest numbers, set-up and collection times, colours or styles you have in mind.";

  return (
    <div className="container-site grid gap-10 pb-24 lg:grid-cols-12 lg:gap-14 lg:pb-32">
      <aside aria-label="Enquiry list" className="lg:order-2 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <EnquirySummary lines={shownLines} ready={ready} />
          <ul className="mt-5 hidden space-y-2.5 px-2 text-small text-stone lg:block">
            {[
              "No payment now, prices are quoted for your dates and venue",
              "Delivery, set-up and collection across the UAE",
              "Availability confirmed by our team",
            ].map((point) => (
              <li key={point} className="flex gap-2.5">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-copper-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <form noValidate onSubmit={onSubmit} className="relative lg:order-1 lg:col-span-7">
        <FormSection number="01" title="Your event" description="Tell us when and where, so we can check availability.">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <Field id={fieldId("eventType")} label="Event type" error={errors.eventType}>
              <Select
                variant="field"
                id={fieldId("eventType")}
                labelId={`${fieldId("eventType")}-label`}
                label="Event type"
                placeholder="Choose event type"
                value={values.eventType}
                options={eventTypeOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => set("eventType", value)}
                invalid={Boolean(errors.eventType)}
                describedBy={describedBy(fieldId("eventType"), errors.eventType)}
              />
            </Field>

            <Field id={fieldId("eventDate")} label="Event date" error={errors.eventDate}>
              <input
                id={fieldId("eventDate")}
                type="date"
                min={today}
                value={values.eventDate}
                onChange={(event) => set("eventDate", event.target.value)}
                aria-invalid={errors.eventDate ? true : undefined}
                aria-describedby={describedBy(fieldId("eventDate"), errors.eventDate)}
                className={cx(inputClass(Boolean(errors.eventDate)), "h-12 cursor-text", !values.eventDate && "text-stone/70")}
              />
            </Field>

            <Field id={fieldId("emirate")} label="Emirate" error={errors.emirate}>
              <Select
                variant="field"
                id={fieldId("emirate")}
                labelId={`${fieldId("emirate")}-label`}
                label="Emirate"
                placeholder="Choose emirate"
                value={values.emirate}
                options={emirates.map((emirate) => ({ value: emirate, label: emirate }))}
                onChange={(value) => set("emirate", value)}
                invalid={Boolean(errors.emirate)}
                describedBy={describedBy(fieldId("emirate"), errors.emirate)}
              />
            </Field>

            <Field id={fieldId("venue")} label="Venue or area" optional>
              <input
                id={fieldId("venue")}
                type="text"
                autoComplete="off"
                placeholder="e.g. Dubai World Trade Centre"
                value={values.venue}
                onChange={(event) => set("venue", event.target.value)}
                className={cx(inputClass(false), "h-12")}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="02" title="Your details" description="Where our team should send the quote.">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
            <ChoiceGroup
              id={fieldId("customerType")}
              name="customerType"
              legend="Which describes you best?"
              options={customerTypes}
              value={values.customerType}
              onChange={(value) => set("customerType", value)}
              error={errors.customerType}
              className="sm:col-span-2"
            />

            <Field id={fieldId("name")} label="Full name" error={errors.name}>
              <input
                id={fieldId("name")}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy(fieldId("name"), errors.name)}
                className={cx(inputClass(Boolean(errors.name)), "h-12")}
              />
            </Field>

            <Field id={fieldId("company")} label="Company" error={errors.company}>
              <input
                id={fieldId("company")}
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={(event) => set("company", event.target.value)}
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy(fieldId("company"), errors.company)}
                className={cx(inputClass(Boolean(errors.company)), "h-12")}
              />
            </Field>

            <Field id={fieldId("email")} label="Email" error={errors.email}>
              <input
                id={fieldId("email")}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="name@company.com"
                value={values.email}
                onChange={(event) => set("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy(fieldId("email"), errors.email)}
                className={cx(inputClass(Boolean(errors.email)), "h-12")}
              />
            </Field>

            <Field id={fieldId("phone")} label="Phone or WhatsApp" error={errors.phone}>
              <input
                id={fieldId("phone")}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+971 50 123 4567"
                value={values.phone}
                onChange={(event) => set("phone", event.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describedBy(fieldId("phone"), errors.phone)}
                className={cx(inputClass(Boolean(errors.phone)), "h-12")}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="03" title={listEmpty ? "What you need" : "Anything else"}>
          <div className="space-y-6">
            <Field
              id={fieldId("message")}
              label={listEmpty ? "Describe the furniture you need" : "Notes for our team"}
              optional={!listEmpty}
              error={errors.message}
              hint={messageHint}
            >
              <textarea
                id={fieldId("message")}
                rows={5}
                placeholder={listEmpty ? "e.g. 120 white banquet chairs, 12 round tables and 4 lounge sets" : undefined}
                value={values.message}
                onChange={(event) => set("message", event.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={describedBy(fieldId("message"), errors.message, messageHint)}
                className={cx(inputClass(Boolean(errors.message)), "block resize-y py-3 leading-relaxed")}
              />
            </Field>

            <FileField
              id={fieldId("attachment")}
              label="Floor plan or mood board"
              hint="PDF, JPG or PNG, up to 10 MB"
              accept={ATTACHMENT_TYPES.join(",")}
              file={values.attachment}
              onChange={(file) => set("attachment", file)}
              error={errors.attachment}
            />
          </div>
        </FormSection>

        {/* Honeypot: hidden from people and assistive tech, filled in by bots */}
        <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
          <label>
            Website
            <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="border-t border-forest-900/10 pt-8">
          {status === "error" && (
            <div role="alert" className="mb-6 flex gap-3 rounded-2xl bg-red-50 p-4 text-small text-red-900">
              <AlertIcon className="mt-0.5 size-5 shrink-0 text-red-700" />
              <p>
                <span className="font-semibold">We couldn&apos;t send your request.</span> Please try again, or reach us
                on{" "}
                <a href={site.phoneHref} className="font-semibold underline underline-offset-2">
                  {site.phone}
                </a>{" "}
                or{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
                  {site.email}
                </a>
                .
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="submit"
              aria-disabled={sending}
              className={cx(
                "inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-forest-800 px-8 font-semibold whitespace-nowrap text-cream-50 transition-colors hover:bg-forest-950",
                sending ? "cursor-wait" : "cursor-pointer",
              )}
            >
              {sending ? (
                <>
                  <span
                    aria-hidden
                    className="size-4 animate-spin rounded-full border-2 border-cream-50/30 border-t-cream-50"
                  />
                  Sending request
                </>
              ) : (
                <>
                  Send quote request
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
            <p className="text-small text-stone">
              {errorCount > 0 ? (
                <span className="text-red-700">
                  {errorCount === 1 ? "1 field needs" : `${errorCount} fields need`} your attention
                </span>
              ) : (
                "No payment needed. We reply with availability and a quote."
              )}
            </p>
          </div>
          <p role="status" className="sr-only">
            {sending ? "Sending your quote request" : ""}
          </p>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const headingId = `quote-section-${number}`;
  return (
    <section aria-labelledby={headingId} className="border-t border-forest-900/10 py-10 first:border-t-0 first:pt-0">
      <div className="mb-7 flex gap-4">
        <span aria-hidden className="pt-1.5 text-small font-semibold text-copper-600 tabular-nums">
          {number}
        </span>
        <div>
          <h2 id={headingId} className="text-h4 text-forest-900">
            {title}
          </h2>
          {description && <p className="mt-1 text-small text-stone">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
