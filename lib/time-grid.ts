/** עזרים משותפים לבניית ציר-זמן ויזואלי למערכת השעות (client-side בלבד). */

export function timeStrToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** מעגל כלפי מטה ל-30 הדקות הקרובות. */
export function floorToHalfHour(minutes: number): number {
  return Math.floor(minutes / 30) * 30;
}

/** מעגל כלפי מעלה ל-30 הדקות הקרובות. */
export function ceilToHalfHour(minutes: number): number {
  return Math.ceil(minutes / 30) * 30;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} דק׳`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} שע׳` : `${h} שע׳ ו-${m} דק׳`;
}
