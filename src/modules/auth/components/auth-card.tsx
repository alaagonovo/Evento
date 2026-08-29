import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export function AuthCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12",
        className,
      )}
    >
      <Card>
        <CardHeader className="space-y-2">
          <h1 className="font-heading text-2xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
