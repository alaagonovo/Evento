import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = value >= index + 1;
        const half = !filled && value >= index + 0.5;

        return (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              filled || half ? "fill-gold text-gold" : "fill-transparent text-border",
            )}
          />
        );
      })}
    </span>
  );
}
