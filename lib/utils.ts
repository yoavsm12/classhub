import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** ממיר שם מקצוע בעברית/אנגלית ל-slug בטוח ל-URL. שומר על אותיות עברית. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** בודק שה-URL תקין ומשתמש אך ורק בפרוטוקול http/https, למניעת javascript: וכד'. */
export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}

const dateTimeFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateTimeFormatter.format(date);
}

/** מספר ימים (יכול להיות שלילי) מהיום ועד לתאריך הנתון. */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** "10:55:00" -> "10:55" */
export function formatTime(value: string): string {
  return value.slice(0, 5);
}

export function relativeDayLabel(dateStr: string): string {
  const diff = daysUntil(dateStr);
  if (diff === 0) return "היום";
  if (diff === 1) return "מחר";
  if (diff === -1) return "אתמול";
  if (diff > 1) return `בעוד ${diff} ימים`;
  return `לפני ${Math.abs(diff)} ימים`;
}
