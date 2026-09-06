"use client";

import { useEffect, useMemo, useState } from "react";
import { DAY_OF_WEEK_LABELS, SCHOOL_WEEK_DAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScheduleTimeGrid } from "@/components/class/schedule-time-grid";
import type { ScheduleSlotWithSubject } from "@/lib/types";

const GROUP_STORAGE_KEY = "classhub_schedule_group";

function readSavedGroup(): string | null {
  try {
    return window.localStorage.getItem(GROUP_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveGroup(group: string | null) {
  try {
    if (group) window.localStorage.setItem(GROUP_STORAGE_KEY, group);
    else window.localStorage.removeItem(GROUP_STORAGE_KEY);
  } catch {
    // localStorage לא זמין (מצב פרטי וכד') — פשוט לא שומרים, לא קריטי לתפקוד.
  }
}

function GroupPickerModal({ groups, onSelect }: { groups: string[]; onSelect: (group: string | null) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <h2 className="text-lg font-bold text-neutral-900">איזו קבוצה אתה?</h2>
        <p className="mt-1 text-sm text-neutral-500">
          חלק מהשיעורים מתחלקים בין קבוצות מקבילות. בחר את הקבוצה שלך כדי לראות רק את השעות הרלוונטיות לך.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => onSelect(group)}
              className="rounded-xl border border-neutral-300 px-4 py-3 text-base font-medium hover:bg-neutral-100"
            >
              קבוצה {group}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="mt-1 rounded-xl px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600"
          >
            הצג את כל השיעורים (בלי סינון)
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScheduleView({ slots }: { slots: ScheduleSlotWithSubject[] }) {
  const todayIndex = new Date().getDay(); // 0=ראשון ... 6=שבת, תואם למוסכמה שלנו
  const defaultDay = SCHOOL_WEEK_DAYS.includes(todayIndex as (typeof SCHOOL_WEEK_DAYS)[number])
    ? todayIndex
    : SCHOOL_WEEK_DAYS[0];
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const availableGroups = useMemo(
    () => Array.from(new Set(slots.map((s) => s.group_label).filter((g): g is string => !!g))).sort(),
    [slots]
  );

  // undefined = עדיין לא נטען מ-localStorage (מונע הבהוב SSR/CSR), null = "הצג הכול"
  const [selectedGroup, setSelectedGroup] = useState<string | null | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect --
     קריאת localStorage חייבת לקרות אחרי ה-mount (לא זמינה ב-SSR); זו הדרך
     המקובלת למנוע hydration mismatch בקריאה חד-פעמית ממקור חיצוני כזה. */
  useEffect(() => {
    if (availableGroups.length === 0) {
      setSelectedGroup(null);
      return;
    }
    const saved = readSavedGroup();
    if (saved && availableGroups.includes(saved)) {
      setSelectedGroup(saved);
    } else {
      setSelectedGroup(null);
      setShowPicker(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- רק בטעינה הראשונה
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSelect(group: string | null) {
    setSelectedGroup(group);
    saveGroup(group);
    setShowPicker(false);
  }

  const visibleSlots =
    selectedGroup === undefined ? [] : slots.filter((s) => !s.group_label || s.group_label === selectedGroup);

  if (slots.length === 0) {
    return <p className="text-sm text-neutral-400">מערכת השעות עוד לא הוגדרה.</p>;
  }

  return (
    <div>
      {showPicker && <GroupPickerModal groups={availableGroups} onSelect={handleSelect} />}

      {availableGroups.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-neutral-100 px-3 py-2 text-sm">
          <span className="text-neutral-600">
            {selectedGroup ? (
              <>
                מציג את מערכת השעות של <strong>קבוצה {selectedGroup}</strong>
              </>
            ) : (
              "מציג את כל השיעורים (כל הקבוצות)"
            )}
          </span>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="shrink-0 font-medium text-neutral-900 underline-offset-2 hover:underline"
          >
            החלף קבוצה
          </button>
        </div>
      )}

      {/* מובייל: טאבים ליום נבחר + ציר זמן ליום אחד */}
      <div className="sm:hidden">
        <div className="mb-3 flex gap-1 overflow-x-auto">
          {SCHOOL_WEEK_DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                selectedDay === day ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
              )}
            >
              {DAY_OF_WEEK_LABELS[day]}
              {day === todayIndex && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />}
            </button>
          ))}
        </div>
        <ScheduleTimeGrid slots={visibleSlots} days={[selectedDay]} todayIndex={todayIndex} />
      </div>

      {/* דסקטופ: כל השבוע בציר זמן אחד משותף */}
      <div className="hidden sm:block">
        <ScheduleTimeGrid slots={visibleSlots} days={[...SCHOOL_WEEK_DAYS]} todayIndex={todayIndex} />
      </div>
    </div>
  );
}
