"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { UserAvatar } from "@/shared/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type UserMenuLink = {
  href: string;
  label: string;
};

type UserMenuProps = {
  fullName: string;
  avatarUrl?: string | null;
  menuLabel: string;
  links: UserMenuLink[];
  children?: ReactNode;
};

export function UserMenu({ fullName, avatarUrl, menuLabel, links, children }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={menuLabel}
            className="flex max-w-[12.5rem] items-center gap-2 rounded-full py-1 ps-1 pe-2.5 text-start text-sm text-foreground transition-colors hover:bg-muted"
          >
            <UserAvatar name={fullName} src={avatarUrl} />
            <span className="hidden min-w-0 truncate sm:inline">{fullName}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-48 w-52"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          {links.map((link) => (
            <DropdownMenuItem key={link.href} asChild className="cursor-pointer px-2.5 py-2">
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
          {children ? (
            <>
              <DropdownMenuSeparator />
              {children}
            </>
          ) : null}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
