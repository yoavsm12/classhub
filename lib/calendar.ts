import { CALENDAR_END_MONTH, CALENDAR_START_MONTH } from "@/lib/constants";

export interface MonthKey {
  year: number;
  month: number; // 1-12
}

export function monthKeyToString({ year, month }: MonthKey): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function monthKeyFromString(value: string): MonthKey | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) };
}

function monthIndex({ year, month }: MonthKey): number {
  return year * 12 + (month - 1);
}

export function clampMonthToCalendarRange(key: MonthKey): MonthKey {
  if (monthIndex(key) < monthIndex(CALENDAR_START_MONTH)) return CALENDAR_START_MONTH;
  if (monthIndex(key) > monthIndex(CALENDAR_END_MONTH)) return CALENDAR_END_MONTH;
  return key;
}

export function addMonths(key: MonthKey, delta: number): MonthKey {
  const total = monthIndex(key) + delta;
  return { year: Math.floor(total / 12), month: (((total % 12) + 12) % 12) + 1 };
}

export function isSameOrBeforeCalendarEnd(key: MonthKey): boolean {
  return monthIndex(key) <= monthIndex(CALENDAR_END_MONTH);
}

export function isSameOrAfterCalendarStart(key: MonthKey): boolean {
  return monthIndex(key) >= monthIndex(CALENDAR_START_MONTH);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** בונה מחרוזת תאריך "YYYY-MM-DD" מבלי לעבור דרך Date/timezone. */
export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** יום בשבוע לפי המוסכמה שלנו: 0=ראשון ... 6=שבת. */
function dayOfWeek(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export interface CalendarDay {
  date: string; // "YYYY-MM-DD"
  day: number;
  inCurrentMonth: boolean;
}

/** בונה את כל התאים להצגה ברשת חודשית (כולל ימי מילוי מהחודש הקודם/הבא), שבוע מתחיל בראשון. */
export function buildMonthGrid({ year, month }: MonthKey): CalendarDay[] {
  const firstWeekday = dayOfWeek(year, month, 1);
  const totalDays = daysInMonth(year, month);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthDays = daysInMonth(prevYear, prevMonth);

  const cells: CalendarDay[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push({ date: toDateString(prevYear, prevMonth, day), day, inCurrentMonth: false });
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push({ date: toDateString(year, month, day), day, inCurrentMonth: true });
  }

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: toDateString(nextYear, nextMonth, nextDay), day: nextDay, inCurrentMonth: false });
    nextDay++;
  }

  return cells;
}
