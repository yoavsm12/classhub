"use client";

import { useEffect, useState } from "react";
import { DAY_OF_WEEK_LABELS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { ceilToHalfHour, floorToHalfHour, formatDuration, minutesToLabel, timeStrToMinutes } from "@/lib/time-grid";
import type { ScheduleSlotWithSubject } from "@/lib/types";

const PX_PER_MIN = 1.3;
const DEFAULT_START_MIN = 8 * 60; // 08:00
const DEFAULT_END_MIN = 17 * 60; // 17:00

/** מחזיר את הדקות-מתחילת-היום הנוכחיות, מתעדכן בלייב כל 30 שניות. */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

function computeBounds(slots: ScheduleSlotWithSubject[]) {
  if (slots.length === 0) return { start: DEFAULT_START_MIN, end: DEFAULT_END_MIN };
  const starts = slots.map((s) => timeStrToMinutes(s.start_time));
  const ends = slots.map((s) => timeStrToMinutes(s.end_time));
  return {
    start: Math.min(DEFAULT_START_MIN, floorToHalfHour(Math.min(...starts))),
    end: Math.max(DEFAULT_END_MIN, ceilToHalfHour(Math.max(...ends))),
  };
}

function HourAxis({ start, end }: { start: number; end: number }) {
  const hours: number[] = [];
  for (let m = Math.ceil(start / 60) * 60; m <= end; m += 60) hours.push(m);

  return (
    <div className="relative w-10 shrink-0 text-left" style={{ height: (end - start) * PX_PER_MIN }}>
      {hours.map((h) => (
        <div
          key={h}
          className="ltr-nums absolute -translate-y-1/2 text-[10px] text-neutral-400"
          style={{ top: (h - start) * PX_PER_MIN }}
        >
          {minutesToLabel(h)}
        </div>
      ))}
    </div>
  );
}

function DayColumn({
  day,
  slots,
  start,
  end,
  isToday,
  nowMinutes,
}: {
  day: number;
  slots: ScheduleSlotWithSubject[];
  start: number;
  end: number;
  isToday: boolean;
  nowMinutes: number | null;
}) {
  const hours: number[] = [];
  for (let m = Math.ceil(start / 60) * 60; m <= end; m += 60) hours.push(m);

  const daySlots = slots.filter((s) => s.day_of_week === day);
  const showNowLine = isToday && nowMinutes !== null && nowMinutes >= start && nowMinutes <= end;

  return (
    <div className="relative flex-1 border-r border-neutral-100 first:border-r-0" style={{ height: (end - start) * PX_PER_MIN }}>
      {hours.map((h) => (
        <div key={h} className="absolute inset-x-0 border-t border-neutral-100" style={{ top: (h - start) * PX_PER_MIN }} />
      ))}

      {daySlots.map((slot) => {
        const top = (timeStrToMinutes(slot.start_time) - start) * PX_PER_MIN;
        const height = (timeStrToMinutes(slot.end_time) - timeStrToMinutes(slot.start_time)) * PX_PER_MIN;
        const compact = height < 70;

        return (
          <div
            key={slot.id}
            title={`${slot.subject.name}${slot.teacher ? ` · ${slot.teacher}` : ""}${slot.room ? ` · חדר ${slot.room}` : ""}`}
            className="absolute inset-x-0.5 flex flex-col overflow-hidden rounded-lg border border-blue-200 bg-blue-50 p-1 text-blue-900"
            style={{ top, height: Math.max(height, 18) }}
          >
            <div className="truncate text-[11px] font-semibold leading-tight">
              {slot.subject.icon} {slot.subject.name}
            </div>
            {!compact && (
              <>
                <div className="truncate text-[10px] leading-tight text-blue-700">
                  {[slot.room && `חדר ${slot.room}`, slot.teacher].filter(Boolean).join(" · ")}
                </div>

                <div className="ltr-nums mx-auto mt-1 rounded-md border border-blue-100 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-neutral-900 shadow-sm">
                  {formatTime(slot.start_time)}
                </div>

                {/* מרווח גמיש שדוחף את "שעת סיום" עד תחתית הבלוק, תמיד */}
                <div className="flex-1" />

                <div className="ltr-nums mx-auto mb-0.5 rounded-md border border-blue-100 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-neutral-900 shadow-sm">
                  {formatTime(slot.end_time)}
                </div>
              </>
            )}
          </div>
        );
      })}

      {showNowLine && (
        <div
          className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-red-500"
          style={{ top: (nowMinutes! - start) * PX_PER_MIN }}
        >
          <span className="absolute -top-1.5 -right-1 h-3 w-3 rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
}

/** פס סטטוס חי: איפה אנחנו עכשיו ביחס לשיעורים של היום. */
function LiveStatusBar({ todaySlots, now }: { todaySlots: ScheduleSlotWithSubject[]; now: Date | null }) {
  if (!now) return null;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...todaySlots].sort((a, b) => timeStrToMinutes(a.start_time) - timeStrToMinutes(b.start_time));

  const current = sorted.find(
    (s) => timeStrToMinutes(s.start_time) <= nowMinutes && nowMinutes < timeStrToMinutes(s.end_time)
  );
  const next = sorted.find((s) => timeStrToMinutes(s.start_time) > nowMinutes);

  if (current) {
    const remaining = timeStrToMinutes(current.end_time) - nowMinutes;
    return (
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
        <span>
          עכשיו: <strong>{current.subject.name}</strong> · נשאר {formatDuration(remaining)}
        </span>
      </div>
    );
  }

  if (next) {
    const untilStart = timeStrToMinutes(next.start_time) - nowMinutes;
    return (
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
        <span>
          השיעור הבא: <strong>{next.subject.name}</strong> בעוד {formatDuration(untilStart)} ({formatTime(next.start_time)})
        </span>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
      אין עוד שיעורים היום 🎉
    </div>
  );
}

export function ScheduleTimeGrid({
  slots,
  days,
  todayIndex,
}: {
  slots: ScheduleSlotWithSubject[];
  days: number[];
  todayIndex: number;
}) {
  const now = useNow();
  const nowMinutes = now ? now.getHours() * 60 + now.getMinutes() : null;
  const { start, end } = computeBounds(slots);

  const showLiveStatus = days.length === 1 && days[0] === todayIndex;
  const todaySlots = slots.filter((s) => s.day_of_week === todayIndex);

  return (
    <div>
      {showLiveStatus && <LiveStatusBar todaySlots={todaySlots} now={now} />}

      {days.length > 1 && (
        <div className="mb-1 flex" style={{ paddingRight: "2.5rem" }}>
          {days.map((day) => (
            <div key={day} className="flex-1 text-center text-xs font-bold text-neutral-600">
              {DAY_OF_WEEK_LABELS[day]}
              {day === todayIndex && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />}
            </div>
          ))}
        </div>
      )}

      <div className="flex overflow-x-auto rounded-xl border border-neutral-100 bg-white p-2">
        <HourAxis start={start} end={end} />
        <div className="flex flex-1 gap-px">
          {days.map((day) => (
            <DayColumn
              key={day}
              day={day}
              slots={slots}
              start={start}
              end={end}
              isToday={day === todayIndex}
              nowMinutes={nowMinutes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
