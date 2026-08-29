import Image from "next/image";
import Link from "next/link";
import { CATEGORY_IMAGES } from "../data/mock";
import type { VendorCategorySlug } from "../types/category";

export type CategoryCardItem = {
  slug: VendorCategorySlug;
  title: string;
  description: string;
  href: string;
};

export function CategoryGrid({ categories }: { categories: CategoryCardItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <Link
          key={category.slug}
          href={category.href}
          className={index === 0 ? "sm:col-span-2" : undefined}
        >
          <article className="group relative h-56 overflow-hidden rounded-2xl shadow-soft sm:h-64">
            <Image
              src={CATEGORY_IMAGES[category.slug]}
              alt={category.title}
              fill
              sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-secondary-foreground">
              <h3 className="font-heading text-2xl">{category.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-secondary-foreground/80">
                {category.description}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
