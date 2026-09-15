"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { addToEnquiry, useEnquiry } from "@/lib/enquiry";
import { quoteHref } from "@/lib/site";

export function ProductEnquiryActions({ code, name }: { code: string; name: string }) {
  const [quantity, setQuantity] = useState(1);
  const inEnquiry = useEnquiry().find((item) => item.code === code)?.quantity ?? 0;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="flex h-14 items-center rounded-full border border-forest-900/15 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            aria-label="Decrease quantity"
            className="grid size-14 cursor-pointer place-items-center rounded-full text-forest-900 hover:bg-cream-100"
          >
            <MinusIcon className="size-4" />
          </button>
          <label htmlFor={`quantity-${code}`} className="sr-only">
            Quantity
          </label>
          <input
            id={`quantity-${code}`}
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Math.floor(Number(event.target.value)) || 1))}
            className="w-12 bg-transparent text-center font-semibold text-forest-900 tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label="Increase quantity"
            className="grid size-14 cursor-pointer place-items-center rounded-full text-forest-900 hover:bg-cream-100"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => addToEnquiry(code, quantity)}
          aria-label={`Add ${quantity} × ${name} to enquiry`}
          className="inline-flex h-14 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-forest-800 px-8 font-semibold whitespace-nowrap text-cream-50 transition-colors hover:bg-forest-950"
        >
          <PlusIcon className="size-4" />
          Add to enquiry
        </button>
      </div>

      <p aria-live="polite" className="mt-3 min-h-6 text-small text-stone">
        {inEnquiry > 0 && (
          <span className="inline-flex items-center gap-2">
            <CheckIcon className="size-4 text-forest-700" />
            {inEnquiry} in your enquiry ·
            <Link href={quoteHref} className="font-semibold text-forest-900 underline underline-offset-4">
              View enquiry
            </Link>
          </span>
        )}
      </p>

      <Link
        href={`${quoteHref}?product=${encodeURIComponent(code)}`}
        className="group mt-3 inline-flex items-center gap-2 text-small font-semibold text-copper-700"
      >
        Ask about availability
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
