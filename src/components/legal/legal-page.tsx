import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/catalogue/catalogue-header";

export type LegalSection = { id: string; title: string; content: ReactNode };

/**
 * Long-form legal text: a contents list that stays in view on desktop beside numbered sections.
 * Section content is plain JSX; paragraphs, lists and links pick up their styles from here.
 */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  /** Shown as "Last updated", e.g. "21 September 2026" */
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="container-site pt-32 pb-12 lg:pt-40 lg:pb-16">
        <Breadcrumbs items={[{ label: title }]} />
        <p className="eyebrow mt-8 text-copper-600">Legal</p>
        <h1 className="mt-4 text-h1 text-forest-900">{title}</h1>
        <p className="mt-5 max-w-2xl text-lead text-stone">{intro}</p>
        <p className="mt-6 text-small text-stone">Last updated {updated}</p>
      </header>

      <div className="container-site grid gap-10 border-t border-forest-900/10 pt-12 pb-24 lg:grid-cols-12 lg:gap-14 lg:pb-32">
        <nav aria-labelledby="contents-heading" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <h2 id="contents-heading" className="eyebrow text-copper-600">
              Contents
            </h2>
            <ol className="mt-4 space-y-1 text-small">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 rounded-lg px-3 py-1.5 text-ink/75 transition-colors hover:bg-cream-100 hover:text-forest-900"
                  >
                    <span className="w-5 shrink-0 text-stone/70 tabular-nums">{index + 1}.</span>{" "}
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="max-w-3xl lg:col-span-8 lg:col-start-5">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-28 border-b border-forest-900/10 py-8 first:pt-0 last:border-b-0"
            >
              <h2 id={`${section.id}-heading`} className="flex gap-3 text-h4 text-forest-900">
                <span className="text-copper-600 tabular-nums">{index + 1}.</span>{" "}
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-stone [&_a]:font-semibold [&_a]:text-forest-900 [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-forest-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-copper-500">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
