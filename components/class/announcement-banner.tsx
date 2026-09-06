import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

export function AnnouncementBanner({ announcement }: { announcement: Announcement }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-lg">📌</span>
          <div>
            <h3 className="font-semibold text-amber-900">{announcement.title}</h3>
            <p className="mt-1 text-sm whitespace-pre-line text-amber-800">{announcement.content}</p>
          </div>
        </div>
        <span className="ltr-nums shrink-0 text-xs text-amber-600">{formatDate(announcement.created_at)}</span>
      </div>
    </div>
  );
}
