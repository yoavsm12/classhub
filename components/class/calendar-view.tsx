"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  buildMonthGrid,
  clampMonthToCalendarRange,
  isSameOrAfterCalendarStart,
  isSameOrBeforeCalendarEnd,
  toDateString,
  type MonthKey,
} from "@/lib/calendar";
import { CALENDAR_END_MONTH, CALENDAR_START_MONTH, EVENT_TYPE_LABELS, MONTH_NAMES_HE } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { EventWithSubject, Holiday } from "@/lib/types";

const WEEKDAY_LABELS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function todayMonthKey(): MonthKey {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function todayDateString(): string {
  const now = new Date();
  return toDateString(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function holidaysOnDate(holidays: Holiday[], date: string): Holiday[] {
  return holidays.filter((h) => h.start_date <= date && date <= h.end_date);
}

export function CalendarView({ events, holidays }: { events: EventWithSubject[]; holidays: Holiday[] }) {
  const [month, setMonth] = useState<MonthKey>(() => clampMonthToCalendarRange(todayMonthKey()));
  const today = todayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const clamped = clampMonthToCalendarRange(todayMonthKey());
    const isTodayInRange = clamped.year === todayMonthKey().year && clamped.month === todayMonthKey().month;
    return isTodayInRange ? today : toDateString(clamped.year, clamped.month, 1);
  });

  const cells = useMemo(() => buildMonthGrid(month), [month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventWithSubject[]>();
    for (const event of events) {
      const list = map.get(event.event_date) ?? [];
      list.push(event);
      map.set(event.event_date, list);
    }
    return map;
  }, [events]);

  const canGoPrev = isSameOrAfterCalendarStart(addMonths(month, -1));
  const canGoNext = isSameOrBeforeCalendarEnd(addMonths(month, 1));

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];
  const selectedHolidays = holidaysOnDate(holidays, selectedDate);

  const isStartMonth = month.year === CALENDAR_START_MONTH.year && month.month === CALENDAR_START_MONTH.month;
  const isEndMonth = month.year === CALENDAR_END_MONTH.year && month.month === CALENDAR_END_MONTH.month;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && setMonth((m) => addMonths(m, -1))}
          disabled={!canGoPrev}
          className="rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
          aria-label="חודש קודם"
        >
          ←
        </button>
        <h2 className="text-lg font-bold text-neutral-900">
          {MONTH_NAMES_HE[month.month - 1]} {month.year}
          {isStartMonth && <span className="mr-1 text-xs font-normal text-neutral-400">(תחילת שנה)</span>}
          {isEndMonth && <span className="mr-1 text-xs font-normal text-neutral-400">(סוף שנה)</span>}
        </h2>
        <button
          type="button"
          onClick={() => canGoNext && setMonth((m) => addMonths(m, 1))}
          disabled={!canGoNext}
          className="rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
          aria-label="חודש הבא"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const dayEvents = eventsByDate.get(cell.date) ?? [];
          const dayHolidays = holidaysOnDate(holidays, cell.date);
          const hasExam = dayEvents.some((e) => e.event_type === "exam");
          const hasAssignment = dayEvents.some((e) => e.event_type === "assignment");
          const isToday = cell.date === today;
          const isSelected = cell.date === selectedDate;

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => setSelectedDate(cell.date)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors",
                cell.inCurrentMonth ? "text-neutral-900" : "text-neutral-300",
                dayHolidays.length > 0 && "bg-amber-50",
                isSelected && "bg-neutral-900 text-white",
                !isSelected && isToday && "ring-2 ring-neutral-900 ring-inset",
                !isSelected && "hover:bg-neutral-100"
              )}
            >
              <span>{cell.day}</span>
              {(hasExam || hasAssignment) && (
                <span className="flex gap-0.5">
                  {hasExam && <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-red-500")} />}
                  {hasAssignment && (
                    <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-emerald-500")} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> מבחן/בוחן
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> הגשה
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-200" /> חופשה
        </span>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="ltr-nums font-bold text-neutral-900">{formatDate(selectedDate)}</h3>

        {selectedHolidays.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {selectedHolidays.map((holiday) => (
              <div key={holiday.id} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                🏖️ {holiday.title}
                {holiday.description && <span className="text-amber-600"> — {holiday.description}</span>}
              </div>
            ))}
          </div>
        )}

        {selectedEvents.length === 0 && selectedHolidays.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">אין כלום מיוחד ביום הזה.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 rounded-lg border border-neutral-100 p-2 text-sm">
                <Badge tone={event.event_type === "exam" ? "danger" : "success"}>
                  {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                <span className="font-medium text-neutral-900">{event.title}</span>
                <span className="text-neutral-400">
                  {event.subject.icon} {event.subject.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
