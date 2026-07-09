"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Nav link that marks itself `aria-current="page"` when active. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm transition-colors hover:text-fg",
        active ? "text-fg" : "text-muted",
      )}
    >
      {label}
    </Link>
  );
}
