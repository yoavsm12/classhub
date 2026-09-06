import { listAnnouncements } from "@/lib/data/announcements";
import {
  deleteAnnouncementAction,
  toggleAnnouncementActiveAction,
  togglePinnedAction,
} from "@/app/admin/(protected)/announcements/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAnnouncementsPage() {
  const announcements = await listAnnouncements();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">הודעות</h1>
        <LinkButton href="/admin/announcements/new" size="sm">
          + הודעה חדשה
        </LinkButton>
      </div>

      {announcements.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא פורסמו הודעות.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {announcement.is_pinned && <Badge tone="warning">📌 נעוצה</Badge>}
                    {!announcement.is_active && <Badge tone="neutral">מוסתרת</Badge>}
                    <span className="font-semibold text-neutral-900">{announcement.title}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{announcement.content}</p>
                  <p className="mt-1 text-xs text-neutral-400">{formatDateTime(announcement.created_at)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <LinkButton href={`/admin/announcements/${announcement.id}/edit`} variant="secondary" size="sm">
                  עריכה
                </LinkButton>

                <form action={togglePinnedAction}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <input type="hidden" name="next_pinned" value={(!announcement.is_pinned).toString()} />
                  <button type="submit" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                    {announcement.is_pinned ? "בטל נעיצה" : "נעץ"}
                  </button>
                </form>

                <form action={toggleAnnouncementActiveAction}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <input type="hidden" name="next_active" value={(!announcement.is_active).toString()} />
                  <button type="submit" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                    {announcement.is_active ? "הסתר" : "הצג"}
                  </button>
                </form>

                <form action={deleteAnnouncementAction}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <ConfirmSubmitButton confirmMessage={`למחוק את ההודעה "${announcement.title}"?`} size="sm">
                    מחיקה
                  </ConfirmSubmitButton>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
