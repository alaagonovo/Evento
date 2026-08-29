"use client";

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
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "default";
}) {
  return (
    <Avatar size={size}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="bg-secondary text-secondary-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
