import { CategoryCard, type CategoryCardItem } from "./category-card";

export type { CategoryCardItem };

export function CategoryGrid({ categories }: { categories: CategoryCardItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
