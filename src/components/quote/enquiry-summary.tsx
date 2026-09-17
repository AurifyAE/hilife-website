"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { cx } from "@/lib/cx";
import { removeFromEnquiry, setEnquiryQuantity } from "@/lib/enquiry";
import type { QuoteProduct } from "@/lib/quote";

export type EnquiryLine = { product: QuoteProduct; quantity: number };

const MAX_QUANTITY = 9999;

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/**
 * The visitor's enquiry list beside the quote form. Sticky on desktop; on phones it sits above
 * the form as a bar that expands to show the pieces.
 */
export function EnquirySummary({ lines, ready }: { lines: EnquiryLine[]; ready: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const pieces = lines.reduce((sum, line) => sum + line.quantity, 0);
  const empty = ready && lines.length === 0;

  return (
    <section aria-labelledby="enquiry-heading" className="rounded-[1.75rem] bg-cream-100 p-2">
      <div className="flex items-center justify-between gap-4 px-4 pt-3.5 pb-3 sm:px-5">
        <div>
          <h2 id="enquiry-heading" className="text-h5 font-semibold text-forest-900">
            Your enquiry
          </h2>
          <p aria-live="polite" className="text-small text-stone">
            {!ready ? "Loading your list…" : empty ? "No pieces added yet" : `${plural(lines.length, "item")} · ${plural(pieces, "piece")}`}
          </p>
        </div>
        {ready && !empty && (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="enquiry-items"
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 text-small font-semibold text-forest-900 lg:hidden"
          >
            {expanded ? "Hide" : "Show"}
            <ChevronDownIcon className={cx("size-4 transition-transform duration-300", expanded && "rotate-180")} />
          </button>
        )}
      </div>

      {!ready ? (
        <div aria-hidden className="space-y-2">
          {[0, 1].map((row) => (
            <div key={row} className="flex animate-pulse gap-3 rounded-2xl bg-white p-2.5">
              <div className="size-20 rounded-xl bg-studio" />
              <div className="flex-1 space-y-2 py-2">
                <div className="h-2.5 w-1/3 rounded-full bg-cream-200" />
                <div className="h-3 w-2/3 rounded-full bg-cream-200" />
              </div>
            </div>
          ))}
        </div>
      ) : empty ? (
        <div className="rounded-2xl bg-white px-6 py-9 text-center">
          <p className="text-h6 font-semibold text-forest-900">Your list is empty</p>
          <p className="mx-auto mt-1.5 max-w-xs text-small text-stone">
            Add pieces from the catalogue, or describe what you need in the form.
          </p>
          <ButtonLink href="/furniture" variant="outline-dark" size="md" className="mt-5">
            Browse furniture
          </ButtonLink>
        </div>
      ) : (
        <div id="enquiry-items" className={cx(!expanded && "hidden", "lg:block")}>
          <ul
            data-lenis-prevent
            className="max-h-[min(30rem,60vh)] space-y-2 overflow-y-auto overscroll-contain lg:max-h-[calc(100vh-22rem)]"
          >
            {lines.map((line) => (
              <EnquiryRow key={line.product.code} line={line} />
            ))}
          </ul>
          <div className="px-4 pt-3.5 pb-2.5 sm:px-5">
            <Link
              href="/furniture"
              className="inline-flex items-center gap-2 text-small font-semibold text-forest-900 underline-offset-4 hover:underline"
            >
              <PlusIcon className="size-4" />
              Add more furniture
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function EnquiryRow({ line }: { line: EnquiryLine }) {
  const { product, quantity } = line;

  return (
    <li className="flex gap-3 rounded-2xl bg-white p-2.5">
      <Link
        href={product.href}
        tabIndex={-1}
        aria-hidden
        className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-studio"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="80px"
            className={product.cutout ? "object-contain p-1.5" : "object-cover"}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[0.5625rem] font-semibold text-forest-900/25">
            {product.code}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 pt-0.5">
            <p className="text-[0.6875rem] font-medium tracking-wide text-copper-600">{product.code}</p>
            <Link
              href={product.href}
              className="line-clamp-2 text-small leading-snug font-semibold text-forest-900 underline-offset-4 hover:underline"
            >
              {product.name}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => removeFromEnquiry(product.code)}
            aria-label={`Remove ${product.name}`}
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-stone transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="truncate text-[0.8125rem] text-stone">{product.collection}</span>
          <QuantityStepper code={product.code} name={product.name} quantity={quantity} />
        </div>
      </div>
    </li>
  );
}

function QuantityStepper({ code, name, quantity }: { code: string; name: string; quantity: number }) {
  // What the visitor is typing, so clearing the box to type a new number doesn't snap back to 1
  const [draft, setDraft] = useState<string | null>(null);
  const change = (next: number) => setEnquiryQuantity(code, Math.min(MAX_QUANTITY, Math.max(1, next)));

  return (
    <div className="flex h-9 shrink-0 items-center rounded-full border border-forest-900/15">
      <button
        type="button"
        onClick={() => change(quantity - 1)}
        disabled={quantity <= 1}
        aria-label={`Decrease quantity of ${name}`}
        className="grid size-9 cursor-pointer place-items-center rounded-full text-forest-900 hover:bg-cream-100 disabled:cursor-not-allowed disabled:text-stone/40 disabled:hover:bg-transparent"
      >
        <MinusIcon className="size-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QUANTITY}
        value={draft ?? quantity}
        aria-label={`Quantity of ${name}`}
        onChange={(event) => {
          setDraft(event.target.value);
          const next = Math.floor(Number(event.target.value));
          if (next >= 1) change(next);
        }}
        onBlur={() => setDraft(null)}
        className="w-10 bg-transparent text-center text-small font-semibold text-forest-900 tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => change(quantity + 1)}
        aria-label={`Increase quantity of ${name}`}
        className="grid size-9 cursor-pointer place-items-center rounded-full text-forest-900 hover:bg-cream-100"
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
