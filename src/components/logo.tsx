import { cx } from "@/lib/cx";

/** Placeholder logo. Replace with the official Hi-Life logo when it is supplied. */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";

  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden>
        <rect x="1" y="1" width="38" height="38" rx="10" fill={light ? "#fcfbf8" : "#1f4a3b"} />
        <path d="M13 27 27 13" stroke="#b27c4b" strokeWidth="5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="3.25" fill={light ? "#1f4a3b" : "#fcfbf8"} />
      </svg>
      <span className="text-[1.0625rem] font-semibold uppercase tracking-[0.22em]">
        Logoipsum
      </span>
    </span>
  );
}
