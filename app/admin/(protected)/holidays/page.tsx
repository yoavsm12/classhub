import { listHolidays } from "@/lib/data/holidays";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { deleteHolidayAction } from "@/app/admin/(protected)/holidays/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { formatDate } from "@/lib/utils";

export default async function AdminHolidaysPage({ searchParams }: PageProps<"/admin/holidays">) {
  const params = await searchParams;
  const holidays = await listHolidays();

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">חופשות וחגים</h1>
          <p className="text-sm text-neutral-500">מוצג בלוח השנה של התלמידים (`/class/calendar`).</p>
        </div>
        <LinkButton href="/admin/holidays/new" size="sm">
          + חופשה חדשה
        </LinkButton>
      </div>

      {holidays.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא נוספו חופשות.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {holidays.map((holiday) => (
            <Card key={holiday.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-40 flex-1">
                <span className="font-semibold text-neutral-900">{holiday.title}</span>
                <div className="text-xs text-neutral-400 ltr-nums">
                  {formatDate(holiday.start_date)}
                  {holiday.end_date !== holiday.start_date && <> – {formatDate(holiday.end_date)}</>}
                </div>
                {holiday.description && <p className="mt-1 text-sm text-neutral-600">{holiday.description}</p>}
              </div>
              <LinkButton href={`/admin/holidays/${holiday.id}/edit`} variant="secondary" size="sm">
                עריכה
              </LinkButton>
              <form action={deleteHolidayAction}>
                <input type="hidden" name="id" value={holiday.id} />
                <ConfirmSubmitButton confirmMessage={`למחוק את "${holiday.title}"?`} size="sm">
                  מחיקה
                </ConfirmSubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
