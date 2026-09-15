import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cx } from "@/lib/cx";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-small text-stone">
        <li>
          <Link href="/" className="hover:text-forest-900">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden className="text-stone/40">
              /
            </span>
            {item.href ? (
              <Link href={item.href} className="hover:text-forest-900">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-forest-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CatalogueHeader({
  crumbs,
  eyebrow,
  title,
  description,
  image,
  focus,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  description: string;
  image?: StaticImageData;
  focus?: string;
}) {
  return (
    <header className="container-site pt-32 pb-12 lg:pt-40 lg:pb-16">
      <Breadcrumbs items={crumbs} />
      <div className={cx("mt-8 grid items-end gap-10", image && "lg:grid-cols-12 lg:gap-14")}>
        <div className={cx(image && "lg:col-span-7")}>
          <p className="eyebrow text-copper-600">{eyebrow}</p>
          <h1 className="mt-4 text-h1 text-forest-900">{title}</h1>
          <p className="mt-5 max-w-2xl text-lead text-stone">{description}</p>
        </div>
        {image && (
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-forest-900 lg:col-span-5 lg:block">
            <Image
              src={image}
              alt=""
              fill
              preload
              placeholder="blur"
              sizes="40vw"
              style={{ objectPosition: focus }}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}
