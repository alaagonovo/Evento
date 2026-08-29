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

export function CategoryCard({ category }: { category: CategoryCardItem }) {
  return (
    <Link href={category.href} className="block h-full">
      <article className="group relative h-52 overflow-hidden rounded-2xl shadow-soft sm:h-56">
        <Image
          src={CATEGORY_IMAGES[category.slug]}
          alt={category.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
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
  );
}
