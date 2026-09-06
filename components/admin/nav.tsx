"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "לוח בקרה" },
  { href: "/admin/subjects", label: "מקצועות" },
  { href: "/admin/schedule", label: "מערכת שעות" },
  { href: "/admin/resources", label: "חומרים" },
  { href: "/admin/events", label: "מבחנים והגשות" },
  { href: "/admin/holidays", label: "חופשות" },
  { href: "/admin/announcements", label: "הודעות" },
  { href: "/admin/reports", label: "דיווחים" },
  { href: "/admin/settings", label: "הגדרות" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:px-0">
      {links.map((link) => {
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
