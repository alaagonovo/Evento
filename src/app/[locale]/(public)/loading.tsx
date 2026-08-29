import { Container } from "@/shared/components/container";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      <Skeleton className="h-[34rem] w-full rounded-none sm:h-[40rem]" />
      <Container className="space-y-6 py-16">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      </Container>
    </div>
  );
}
