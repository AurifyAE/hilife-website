"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { NotchCard } from "@/components/ui/notch-card";
import { featuredProjects } from "@/data/projects";
import { cx } from "@/lib/cx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-project]").forEach((row) => {
          const photo = row.querySelector("[data-project-photo]");
          const media = row.querySelector("[data-project-media]");
          const details = row.querySelectorAll("[data-project-reveal]");
          // The photo opens from its outer edge
          const hidden = row.dataset.photoSide === "right" ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 75%", once: true } })
            .fromTo(
              photo,
              { clipPath: hidden },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", clearProps: "clipPath" },
            )
            .fromTo(media, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0)
            .fromTo(
              details,
              { y: 32, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" },
              0.35,
            );

          // Photos drift gently while the row is on screen
          gsap.fromTo(
            media,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
            },
          );

          // Key numbers count up from zero
          row.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
            const target = Number(element.dataset.count);
            const counter = { value: 0 };
            element.textContent = "0";
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 85%", once: true },
              onUpdate: () => {
                element.textContent = Math.round(counter.value).toLocaleString("en-US");
              },
            });
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="portfolio" aria-labelledby="portfolio-heading" className="section-y bg-cream-50">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-copper-600">Portfolio</p>
            <h2 id="portfolio-heading" className="mt-4 text-h2 text-forest-900">
              Spaces we&apos;ve set up
            </h2>
            <p className="mt-5 text-lead text-stone">
              A look at how our furniture comes together at real venues, from conference halls to
              garden receptions.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 self-start text-small font-semibold tracking-wide text-forest-900 md:self-auto"
          >
            View all projects
            <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
              <ArrowRightIcon className="size-4" />
            </span>
          </Link>
        </div>

        <ol className="mt-14 space-y-20 lg:mt-20 lg:space-y-32">
          {featuredProjects.map((project, index) => {
            const photoRight = index % 2 === 1;
            return (
              <li
                key={project.slug}
                data-project
                data-photo-side={photoRight ? "right" : "left"}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <div data-project-photo className={cx("lg:col-span-7", photoRight && "lg:order-2")}>
                  <NotchCard
                    href={`/portfolio/${project.slug}`}
                    label={project.title}
                    className="aspect-[4/3]"
                    cardClassName="rounded-[1.25rem] bg-forest-900 lg:rounded-[1.75rem]"
                    actionClassName="bg-copper-500 text-white group-hover:bg-forest-900"
                    notch={{ size: "clamp(3.25rem, 2.5rem + 1.5vw, 4.25rem)" }}
                  >
                    <div data-project-media className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        style={{ objectPosition: project.focus }}
                        className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </NotchCard>
                </div>

                <div className={cx("lg:col-span-5", photoRight && "lg:order-1")}>
                  <div data-project-reveal className="flex flex-wrap items-center gap-3">
                    <span className="eyebrow text-copper-600">
                      Case study {String(index + 1).padStart(2, "0")}
                    </span>
                    {project.sample && (
                      <span className="rounded-full bg-copper-100 px-2.5 py-0.5 text-[0.75rem] font-medium text-copper-700">
                        Sample project
                      </span>
                    )}
                  </div>
                  <h3 data-project-reveal className="mt-4 text-h3 text-forest-900">
                    {project.title}
                  </h3>
                  <p data-project-reveal className="mt-2 text-small font-medium text-stone">
                    {project.location} · {project.eventType}
                  </p>
                  <p data-project-reveal className="mt-5 text-stone">
                    {project.summary}
                  </p>

                  <dl data-project-reveal className="mt-8 grid grid-cols-3 gap-4 border-y border-forest-900/10 py-6">
                    {project.stats.map((stat) => (
                      // Label comes first for valid <dl> markup; column-reverse shows the number on top
                      <div key={stat.label} className="flex flex-col-reverse gap-1">
                        <dt className="text-small text-stone">{stat.label}</dt>
                        <dd className="text-h3 text-forest-900">
                          <span data-count={stat.value}>{stat.value.toLocaleString("en-US")}</span>
                          {stat.unit}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul data-project-reveal className="mt-6 flex flex-wrap gap-1.5" aria-label="Collections used">
                    {project.collections.map((collection) => (
                      <li
                        key={collection}
                        className="rounded-full border border-forest-900/15 px-2.5 py-0.5 text-[0.75rem] text-forest-900/80"
                      >
                        {collection}
                      </li>
                    ))}
                  </ul>

                  <Link
                    data-project-reveal
                    href={`/portfolio/${project.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 text-small font-semibold tracking-wide text-forest-900"
                  >
                    View project
                    <span className="grid size-10 place-items-center rounded-full border border-forest-900/20 transition-colors group-hover:border-copper-500 group-hover:bg-copper-500 group-hover:text-white">
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
