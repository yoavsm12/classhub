import Link from "next/link";
import { listSubjects } from "@/lib/data/subjects";
import { countActiveResources, listRecentResources } from "@/lib/data/resources";
import { countUpcomingEvents, listUpcomingEvents } from "@/lib/data/events";
import { countOpenReports, listReports } from "@/lib/data/reports";
import { countTodayEntries } from "@/lib/data/access-log";
import { getTodayEntryCountAction } from "@/app/admin/(protected)/actions";
import { Card } from "@/components/ui/card";
import { LiveEntryCounter } from "@/components/admin/live-entry-counter";
import { formatDateTime, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [
    subjects,
    activeResourceCount,
    upcomingEventCount,
    openReportCount,
    todayEntryCount,
    recentResources,
    upcomingEvents,
    openReports,
  ] = await Promise.all([
    listSubjects({ onlyActive: true }),
    countActiveResources(),
    countUpcomingEvents(),
    countOpenReports(),
    countTodayEntries(),
    listRecentResources(5),
    listUpcomingEvents(5),
    listReports("open"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">לוח בקרה</h1>
        <p className="text-sm text-neutral-500">סקירה כללית של הכיתה.</p>
      </div>

      <LiveEntryCounter initialCount={todayEntryCount} action={getTodayEntryCountAction} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="מקצועות פעילים" value={subjects.length} />
        <StatCard label="חומרים פעילים" value={activeResourceCount} />
        <StatCard label="אירועים קרובים" value={upcomingEventCount} />
        <StatCard label="דיווחים פתוחים" value={openReportCount} tone={openReportCount > 0 ? "warning" : undefined} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-bold text-neutral-900">הוספה מהירה</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <QuickAdd href="/admin/resources/new" icon="📄" label="חומר לימוד" hint="סיכום, מצגת, דף תרגול" />
          <QuickAdd href="/admin/events/new" icon="📝" label="מבחן / הגשה" hint="עם תאריך ונושאים" />
          <QuickAdd href="/admin/holidays/new" icon="🏖️" label="חופשה / חג" hint="טווח תאריכים בלוח" />
          <QuickAdd href="/admin/schedule/new" icon="🕘" label="שיעור במערכת" hint="יום, שעה, מרצה, חדר" />
          <QuickAdd href="/admin/announcements/new" icon="📣" label="הודעה" hint="הודעה לכיתה" />
          <QuickAdd href="/admin/subjects/new" icon="📚" label="מקצוע" hint="מקצוע לימוד חדש" />
        </div>
        <p className="text-xs text-neutral-400">
          טיפ: בכל טופס יש כפתור <strong>&quot;שמור והוסף עוד&quot;</strong> — נוח להזנה של הרבה פריטים ברצף.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">חומרים אחרונים</h2>
            <Link href="/admin/resources" className="text-sm text-neutral-500 hover:text-neutral-800">
              הצג הכול
            </Link>
          </div>
          <Card className="divide-y divide-neutral-100 p-0">
            {recentResources.length === 0 ? (
              <p className="p-4 text-sm text-neutral-400">אין חומרים עדיין.</p>
            ) : (
              recentResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-medium text-neutral-800">{resource.title}</span>
                  <span className="text-xs text-neutral-400">{formatDateTime(resource.created_at)}</span>
                </div>
              ))
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">אירועים קרובים</h2>
            <Link href="/admin/events" className="text-sm text-neutral-500 hover:text-neutral-800">
              הצג הכול
            </Link>
          </div>
          <Card className="divide-y divide-neutral-100 p-0">
            {upcomingEvents.length === 0 ? (
              <p className="p-4 text-sm text-neutral-400">אין אירועים קרובים.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-medium text-neutral-800">
                    {event.title} — {event.subject.name}
                  </span>
                  <span className="ltr-nums text-xs text-neutral-400">{formatDate(event.event_date)}</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-neutral-900">דיווחים פתוחים אחרונים</h2>
          <Link href="/admin/reports" className="text-sm text-neutral-500 hover:text-neutral-800">
            הצג הכול
          </Link>
        </div>
        <Card className="divide-y divide-neutral-100 p-0">
          {openReports.length === 0 ? (
            <p className="p-4 text-sm text-neutral-400">אין דיווחים פתוחים 🎉</p>
          ) : (
            openReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 text-sm">
                <span className="font-medium text-neutral-800">{report.resource.title}</span>
                <span className="text-xs text-neutral-400">{formatDateTime(report.created_at)}</span>
              </div>
            ))
          )}
        </Card>
      </section>
    </div>
  );
}

function QuickAdd({ href, icon, label, hint }: { href: string; icon: string; label: string; hint: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-neutral-900">+ {label}</span>
      <span className="text-xs text-neutral-400">{hint}</span>
    </Link>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: "warning" }) {
  return (
    <Card className={tone === "warning" && value > 0 ? "border-amber-300 bg-amber-50" : undefined}>
      <div className="text-2xl font-bold text-neutral-900">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </Card>
  );
}
