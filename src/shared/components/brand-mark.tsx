import { cn } from "@/shared/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="size-2 rotate-45 bg-gold shadow-[0_0_0_3px_oklch(0.82_0.068_82_/_0.25)]"
      />
      <span className="font-heading text-2xl leading-none tracking-tight">Evento</span>
    </span>
  );
}
