"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

export type SelectOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** Accessible name. The pill shows it before the value; fields are named by labelId instead */
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /**
   * pill: compact toolbar control ("Sort: Featured").
   * field: full-width form control with a <label> above it, pointed to by labelId.
   */
  variant?: "pill" | "field";
  /** Id of the external <label> (field variant) */
  labelId?: string;
  /** Trigger id, so the label's htmlFor and error focusing can reach it */
  id?: string;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

/**
 * Dropdown in the site style. A native <select> menu can't be styled, so this follows the
 * ARIA select-only combobox pattern: focus moves to the listbox, arrows move the highlight,
 * Enter or Space picks, Escape and Tab close.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  variant = "pill",
  labelId,
  id: triggerId,
  placeholder = "Select",
  invalid = false,
  describedBy,
  className,
}: Props<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const field = variant === "field";
  const selectedIndex = options.findIndex((option) => option.value === value);
  const nameId = field && labelId ? labelId : `${id}-label`;

  const openMenu = () => {
    setActiveIndex(Math.max(0, selectedIndex));
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const pick = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (event: KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(activeIndex + 1, last),
      ArrowUp: Math.max(activeIndex - 1, 0),
      Home: 0,
      End: last,
      PageDown: last,
      PageUp: 0,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActiveIndex(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      close(false);
    }
  };

  return (
    <div ref={rootRef} className={cx("relative", className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        // Select-only combobox: the label names it and the text inside is read as its value
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={nameId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          "inline-flex cursor-pointer items-center border bg-white text-small transition-colors",
          field
            ? "h-12 w-full justify-between gap-3 rounded-xl pr-3.5 pl-4 text-left"
            : "h-11 gap-1.5 rounded-full pr-3 pl-4",
          open
            ? "border-forest-900"
            : invalid
              ? "border-red-700/60 hover:border-red-700"
              : "border-forest-900/15 hover:border-forest-900/40",
        )}
      >
        {!field && (
          <span id={`${id}-label`} className="hidden text-stone sm:inline">
            {label}:
          </span>
        )}
        <span
          className={cx(
            "truncate",
            selectedIndex >= 0 ? (field ? "text-ink" : "font-semibold text-forest-900") : "text-stone/70",
          )}
        >
          {selectedIndex >= 0 ? options[selectedIndex].label : placeholder}
        </span>
        <ChevronDownIcon
          className={cx(
            "size-4 shrink-0 text-forest-900 transition-transform duration-300",
            !field && "ml-0.5",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={nameId}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
          // Keep focus on the list while clicking an option
          onMouseDown={(event) => event.preventDefault()}
          className={cx(
            "absolute top-full z-30 mt-2 rounded-2xl border border-forest-900/10 bg-cream-50 p-1.5 shadow-[0_24px_48px_-16px_rgb(13_35_28/0.28)] focus:outline-none motion-safe:animate-[menu-in_180ms_cubic-bezier(0.22,1,0.36,1)]",
            field ? "inset-x-0 origin-top" : "right-0 w-max min-w-full origin-top-right",
          )}
        >
          {options.map((option, index) => {
            const selected = index === selectedIndex;
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={selected}
                onClick={() => pick(index)}
                onPointerMove={() => setActiveIndex(index)}
                className={cx(
                  "flex cursor-pointer items-center justify-between gap-8 rounded-xl py-2.5 pr-3 pl-3.5 text-small whitespace-nowrap transition-colors",
                  index === activeIndex ? "bg-cream-200/70 text-forest-900" : "text-ink/80",
                  selected && "font-semibold text-forest-900",
                )}
              >
                {option.label}
                <CheckIcon className={cx("size-4 text-copper-600", !selected && "invisible")} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
