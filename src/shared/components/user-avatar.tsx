"use client";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  return `${first}${second}`.toUpperCase();
}

export function UserAvatar({
  name,
  src,
  size = "sm",
  className,
  fallbackClassName,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback
        className={cn("bg-secondary font-heading text-secondary-foreground", fallbackClassName)}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
