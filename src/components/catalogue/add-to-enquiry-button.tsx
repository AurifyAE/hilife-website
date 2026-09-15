"use client";

import Link from "next/link";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { addToEnquiry, useEnquiry } from "@/lib/enquiry";
import { quoteHref } from "@/lib/site";

/** Compact add button for product cards; once added it links to the enquiry list */
export function AddToEnquiryButton({ code, name, className }: { code: string; name: string; className?: string }) {
  const added = useEnquiry().some((item) => item.code === code);
  const shape = "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-small font-semibold transition-colors duration-300";

  if (added) {
    return (
      <Link
        href={quoteHref}
        className={cx(shape, "bg-forest-100 text-forest-900 hover:bg-forest-900 hover:text-cream-50", className)}
      >
        <CheckIcon className="size-4" />
        In your enquiry
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addToEnquiry(code)}
      aria-label={`Add ${name} to enquiry`}
      className={cx(
        shape,
        "cursor-pointer border border-forest-900/20 text-forest-900 hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50",
        className,
      )}
    >
      <PlusIcon className="size-4" />
      Add to enquiry
    </button>
  );
}
