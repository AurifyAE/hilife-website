"use client";

import { useRef, useState, type ReactNode } from "react";
import { AlertIcon, CloseIcon, PaperclipIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

export function inputClass(invalid: boolean) {
  return cx(
    "w-full rounded-xl border bg-white px-4 text-small text-ink transition-[border-color,box-shadow] placeholder:text-stone/60 focus:border-forest-900 focus:ring-4 focus:ring-forest-900/[0.06] focus:outline-none",
    invalid ? "border-red-700/60 hover:border-red-700" : "border-forest-900/15 hover:border-forest-900/40",
  );
}

/** Ids for aria-describedby: the error when there is one, otherwise the hint */
export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

function Optional() {
  return <span className="text-[0.8125rem] font-normal text-stone/70">Optional</span>;
}

export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-snug text-red-700">
        <AlertIcon className="mt-px size-4 shrink-0" />
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] leading-snug text-stone">
      {hint}
    </p>
  ) : null;
}

export function Field({
  id,
  label,
  optional = false,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-3 text-small font-medium text-forest-900"
      >
        {label}
        {optional && <Optional />}
      </label>
      {children}
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

/** Single choice shown as pills; native radios underneath, so arrow keys move between them */
export function ChoiceGroup({
  id,
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
}: {
  id: string;
  name: string;
  legend: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}) {
  return (
    <fieldset className={className} aria-describedby={describedBy(id, error)}>
      <legend className="mb-3 text-small font-medium text-forest-900">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label key={option} className="cursor-pointer">
            <input
              // The first radio carries the id so an error can move focus to the group
              id={index === 0 ? id : undefined}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cx(
                "inline-flex h-10 items-center rounded-full border px-4 text-small transition-colors peer-checked:border-forest-900 peer-checked:bg-forest-900 peer-checked:text-cream-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper-500",
                error
                  ? "border-red-700/50 text-forest-900 hover:border-red-700"
                  : "border-forest-900/15 bg-white text-forest-900 hover:border-forest-900/40",
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      <FieldMessage id={id} error={error} />
    </fieldset>
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** File picker styled as a drop zone; shows the chosen file with a remove button */
export function FileField({
  id,
  label,
  hint,
  accept,
  file,
  onChange,
  error,
  className,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const clear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div className={className}>
      <p id={`${id}-label`} className="mb-2 flex items-baseline justify-between gap-3 text-small font-medium text-forest-900">
        {label}
        <Optional />
      </p>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy(id, error, hint)}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="peer sr-only"
      />

      {file ? (
        <div
          className={cx(
            "flex items-center gap-3 rounded-xl border bg-white py-2.5 pr-2.5 pl-4",
            error ? "border-red-700/60" : "border-forest-900/15",
          )}
        >
          <PaperclipIcon className="size-4 shrink-0 text-copper-600" />
          <p className="min-w-0 flex-1 text-small">
            <span className="block truncate text-ink">{file.name}</span>
            <span className="text-[0.8125rem] text-stone">{formatBytes(file.size)}</span>
          </p>
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${file.name}`}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-stone hover:bg-cream-100 hover:text-forest-900"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const dropped = event.dataTransfer.files[0];
            if (dropped) onChange(dropped);
          }}
          className={cx(
            "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed px-4 py-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper-500",
            dragging
              ? "border-forest-900 bg-forest-100/60"
              : error
                ? "border-red-700/60 bg-white"
                : "border-forest-900/25 bg-white hover:border-forest-900/50",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-100 text-forest-900">
            <PaperclipIcon className="size-[1.125rem]" />
          </span>
          <span className="text-small">
            <span className="block font-semibold text-forest-900">
              Choose a file <span className="font-normal text-stone">or drag it here</span>
            </span>
          </span>
        </label>
      )}

      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
