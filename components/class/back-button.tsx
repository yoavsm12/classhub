"use client";

import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/class") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1.5 text-base font-bold text-neutral-900 hover:text-neutral-700"
    >
      <span aria-hidden="true">→</span>
      חזרה
    </button>
  );
}
