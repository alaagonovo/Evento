import { Container } from "@/shared/components/container";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function VendorDetailLoading() {
  return (
    <Container className="space-y-6 py-8">
      <Skeleton className="h-4 w-48" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_22rem]">
        <div className="space-y-4">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="hidden h-72 rounded-2xl lg:block" />
      </div>
    </Container>
  );
}
