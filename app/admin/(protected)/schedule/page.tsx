import { listScheduleSlots } from "@/lib/data/schedule";
import { deleteScheduleSlotAction } from "@/app/admin/(protected)/schedule/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { DAY_OF_WEEK_LABELS, SCHOOL_WEEK_DAYS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

export default async function AdminSchedulePage() {
  const slots = await listScheduleSlots();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">מערכת שעות</h1>
          <p className="text-sm text-neutral-500">מערכת שעות שבועית קבועה, מוצגת לתלמידים ב-/class/schedule.</p>
        </div>
        <LinkButton href="/admin/schedule/new" size="sm">
          + שיעור חדש
        </LinkButton>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא הוגדרה מערכת שעות.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {SCHOOL_WEEK_DAYS.map((day) => {
            const daySlots = slots.filter((s) => s.day_of_week === day);
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="flex flex-col gap-2">
                <h2 className="font-bold text-neutral-900">יום {DAY_OF_WEEK_LABELS[day]}</h2>
                <div className="flex flex-col gap-2">
                  {daySlots.map((slot) => (
                    <Card key={slot.id} className="flex flex-wrap items-center gap-3">
                      <div className="w-24 shrink-0 text-sm font-semibold text-neutral-900 ltr-nums">
                        {formatTime(slot.start_time)}–{formatTime(slot.end_time)}
                      </div>
                      <div className="min-w-40 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-neutral-900">
                            {slot.subject.icon} {slot.subject.name}
                          </span>
                          {slot.group_label && <Badge tone="neutral">קבוצה {slot.group_label}</Badge>}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {[slot.teacher, slot.room && `חדר ${slot.room}`].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                      <LinkButton href={`/admin/schedule/${slot.id}/edit`} variant="secondary" size="sm">
                        עריכה
                      </LinkButton>
                      <form action={deleteScheduleSlotAction}>
                        <input type="hidden" name="id" value={slot.id} />
                        <ConfirmSubmitButton confirmMessage={`למחוק את השיעור "${slot.subject.name}" ביום ${DAY_OF_WEEK_LABELS[day]}?`} size="sm">
                          מחיקה
                        </ConfirmSubmitButton>
                      </form>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
