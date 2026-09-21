"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import { describedBy, Field, inputClass } from "@/components/quote/form-fields";
import { cx } from "@/lib/cx";
import { getLenis } from "@/lib/lenis";
import { isValidEmail, isValidPhone, sendLead } from "@/lib/leads";
import { site } from "@/lib/site";

type Values = { name: string; company: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: "", company: "", email: "", phone: "", message: "" };
const order: (keyof Values)[] = ["name", "company", "email", "phone", "message"];
const fieldId = (key: keyof Values) => `contact-${key}`;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name";
  if (!values.email.trim()) errors.email = "Enter your email address";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address";
  if (values.phone.trim() && !isValidPhone(values.phone)) errors.phone = "Enter a valid phone number";
  if (values.message.trim().length < 5) errors.message = "Write a short message";
  return errors;
}

function focusField(key: keyof Values) {
  const element = document.getElementById(fieldId(key));
  if (!element) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(element, { offset: -160 });
  else element.scrollIntoView({ block: "center" });
  element.focus({ preventScroll: true });
}

/** General message form. Price and availability requests are pointed to the quote form instead. */
export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentName, setSentName] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errors = attempted ? validate(values) : {};
  const set = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const sending = status === "sending";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setAttempted(true);
    const found = validate(values);
    const firstInvalid = order.find((key) => found[key]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    const done = () => {
      setSentName(values.name.trim().split(/\s+/)[0]);
      setValues(empty);
      setAttempted(false);
      setStatus("sent");
      // The form is replaced by the confirmation: move focus there so it is announced
      requestAnimationFrame(() => successRef.current?.focus());
    };

    // Bots fill in the hidden field: act as if it worked without sending anything
    if (honeypotRef.current?.value) {
      done();
      return;
    }

    setStatus("sending");
    try {
      const body = new FormData();
      body.set("source", "Contact form");
      for (const key of order) if (values[key].trim()) body.set(key, values[key].trim());
      await sendLead(body);
      done();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} className="py-10 text-center focus:outline-none sm:py-16">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest-100 text-forest-900 motion-safe:animate-[menu-in_500ms_cubic-bezier(0.22,1,0.36,1)]">
          <CheckIcon className="size-6" />
        </span>
        <h2 className="mt-6 text-h3 text-forest-900">Thank you{sentName ? `, ${sentName}` : ""}</h2>
        <p className="mx-auto mt-3 max-w-sm text-stone">
          Your message is on its way. Someone from our team will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex h-11 cursor-pointer items-center rounded-full border border-forest-900/20 px-6 text-small font-semibold text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative">
      <h2 className="text-h3 text-forest-900">Send us a message</h2>
      <p className="mt-2 text-small text-stone">
        Questions about delivery, a past order or working with us. We reply by email or phone.
      </p>

      <div className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2">
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
        <Field id={fieldId("company")} label="Company" optional>
          <input
            id={fieldId("company")}
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => set("company", event.target.value)}
            className={cx(inputClass(false), "h-12")}
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
        <Field id={fieldId("phone")} label="Phone or WhatsApp" optional error={errors.phone}>
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
        <Field id={fieldId("message")} label="Message" error={errors.message} className="sm:col-span-2">
          <textarea
            id={fieldId("message")}
            rows={6}
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy(fieldId("message"), errors.message)}
            className={cx(inputClass(Boolean(errors.message)), "block resize-y py-3 leading-relaxed")}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech, filled in by bots */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl bg-red-50 p-4 text-small text-red-900">
          <AlertIcon className="mt-0.5 size-5 shrink-0 text-red-700" />
          <p>
            <span className="font-semibold">We couldn&apos;t send your message.</span> Please try again, or call us on{" "}
            <a href={site.phoneHref} className="font-semibold underline underline-offset-2">
              {site.phone}
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
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
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-cream-50/30 border-t-cream-50" />
              Sending message
            </>
          ) : (
            <>
              Send message
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </button>
        {Object.keys(errors).length > 0 && (
          <p className="text-small text-red-700">Check the highlighted fields</p>
        )}
      </div>
      <p role="status" className="sr-only">
        {sending ? "Sending your message" : ""}
      </p>
    </form>
  );
}
