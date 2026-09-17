import { processSteps } from "@/data/event-details";

/** Dark "How it works" band shared by the Events hub and the event pages */
export function ProcessSteps({ title = "From your list to a furnished venue" }: { title?: string }) {
  return (
    <section aria-labelledby="process-heading" className="bg-forest-950 text-cream-50">
      <div className="container-site section-y grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="eyebrow text-copper-300">How it works</p>
          <h2 id="process-heading" className="mt-4 text-h2 text-cream-50">
            {title}
          </h2>
          <p className="mt-5 text-lead text-cream-50/70">
            No prices to compare and no checkout. Send us what you need and our team does the rest.
          </p>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-[1.5rem] bg-cream-50/10 sm:grid-cols-2 lg:col-span-8">
          {processSteps.map((step, index) => (
            <li key={step.title} className="bg-forest-950 p-7 sm:p-8">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-full border border-copper-300/40 text-small font-semibold text-copper-300 tabular-nums"
              >
                {index + 1}
              </span>
              <h3 className="mt-6 text-h5 font-semibold text-cream-50">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-small text-cream-50/65">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
