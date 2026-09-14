import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

const variants = {
  copper: "bg-copper-600 text-white hover:bg-copper-700",
  forest: "bg-forest-800 text-cream-50 hover:bg-forest-900",
  "outline-light":
    "border border-cream-50/40 text-cream-50 hover:border-cream-50 hover:bg-cream-50 hover:text-forest-900",
  "outline-dark":
    "border border-forest-900/25 text-forest-900 hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50",
};

const sizes = {
  sm: "h-11 px-4 text-small",
  md: "h-11 px-6 text-small",
  lg: "h-14 px-8 text-body",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  variant = "forest",
  size = "lg",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide whitespace-nowrap transition-colors duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
