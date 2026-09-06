import Link from "next/link";
import { guestLogoutAction } from "@/app/actions/guest";
import type { ClassAccess } from "@/lib/auth/session";
import type { ClassSettings } from "@/lib/types";

export function ClassHeader({ settings, access }: { settings: ClassSettings; access: ClassAccess }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/class" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <div>
            <div className="text-sm font-bold leading-tight text-neutral-900">{settings.name}</div>
            <div className="text-xs leading-tight text-neutral-400 ltr-nums">{settings.academic_year}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 overflow-x-auto text-sm">
          <Link href="/class/schedule" className="shrink-0 text-neutral-600 hover:text-neutral-900">
            מערכת שעות
          </Link>
          <Link href="/class/calendar" className="shrink-0 text-neutral-600 hover:text-neutral-900">
            לוח שנה
          </Link>
          <Link href="/class/exams" className="shrink-0 text-neutral-600 hover:text-neutral-900">
            מבחנים
          </Link>
          <Link href="/class/assignments" className="shrink-0 text-neutral-600 hover:text-neutral-900">
            משימות
          </Link>
          {access.kind === "admin" ? (
            <Link
              href="/admin"
              className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-100"
            >
              לוח ניהול
            </Link>
          ) : (
            <form action={guestLogoutAction} className="shrink-0">
              <button type="submit" className="text-neutral-400 hover:text-neutral-700">
                יציאה
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
