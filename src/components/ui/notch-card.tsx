import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

type NotchCardProps = {
  /** Navigate to this URL… */
  href?: string;
  /** …or run this instead (renders buttons). Children must then be inline elements like <span>. */
  onClick?: () => void;
  children: ReactNode;
  /** Outer box: width, aspect ratio, grid placement */
  className?: string;
  /** The card surface that gets the scooped corner: background, radius, padding */
  cardClassName?: string;
  /** Colours of the round button that sits in the notch */
  actionClassName?: string;
  /** Accessible name for the card when the children don't describe it */
  label?: string;
  icon?: ReactNode;
  /** Notch dimensions; defaults live in the notch-mask utility */
  notch?: { size?: string; gap?: string; corner?: string };
};

/** Card with a scooped bottom-right corner holding a round arrow button. */
export function NotchCard({
  href,
  onClick,
  children,
  className,
  cardClassName,
  actionClassName = "bg-white/80 text-copper-700 backdrop-blur-md group-hover:bg-white",
  label,
  icon = <ArrowUpRightIcon className="size-[45%]" />,
  notch,
}: NotchCardProps) {
  const vars = {
    "--notch-size": notch?.size,
    "--notch-gap": notch?.gap,
    "--notch-corner": notch?.corner,
  } as CSSProperties;

  const cardClasses = cx(
    "notch-mask relative isolate block h-full w-full cursor-pointer overflow-hidden text-left",
    cardClassName,
  );
  const actionClasses = cx(
    "absolute right-0 bottom-0 grid size-[calc(var(--notch-size,3.5rem)-var(--notch-gap,0.625rem))] cursor-pointer place-items-center rounded-full transition-colors duration-300",
    actionClassName,
  );

  // The second element duplicates the action so the round button is clickable too;
  // it is hidden from keyboard and screen readers.
  return (
    <div className={cx("group relative", className)} style={vars}>
      {href ? (
        <>
          <Link href={href} aria-label={label} className={cardClasses}>
            {children}
          </Link>
          <Link href={href} tabIndex={-1} aria-hidden className={actionClasses}>
            {icon}
          </Link>
        </>
      ) : (
        <>
          <button type="button" onClick={onClick} aria-label={label} className={cardClasses}>
            {children}
          </button>
          <button
            type="button"
            onClick={onClick}
            tabIndex={-1}
            aria-hidden
            className={actionClasses}
          >
            {icon}
          </button>
        </>
      )}
    </div>
  );
}
