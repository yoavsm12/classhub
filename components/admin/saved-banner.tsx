/**
 * הודעת אישור אחרי שמירה מוצלחת.
 * מוצגת כשה-URL מכיל ?saved=1 (נוסף ע"י ה-Server Action אחרי redirect).
 */
export function SavedBanner({ show, message = "נשמר בהצלחה ✓" }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <div
      role="status"
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
    >
      {message}
    </div>
  );
}

/** עזר קטן: האם ה-searchParams מסמנים שמירה מוצלחת. */
export function isSaved(params: Record<string, string | string[] | undefined>): boolean {
  return params.saved === "1";
}
