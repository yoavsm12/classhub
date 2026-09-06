"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 5000;

/**
 * מונה "כניסות היום" עם עדכון אוטומטי (polling כל 5 שניות).
 * לא Realtime אמיתי (Postgres changefeed) בכוונה — זה היה מחייב לחשוף policy
 * חדש לקריאה דרך ה-publishable key, בסתירה למדיניות "deny-all" הקיימת בכל
 * הטבלאות. polling דרך Server Action מוגן ב-requireAdmin נשאר עקבי עם שאר
 * האפליקציה: כל קריאה לנתונים עוברת רק דרך שרת עם SUPABASE_SECRET_KEY.
 */
export function LiveEntryCounter({
  initialCount,
  action,
}: {
  initialCount: number;
  action: () => Promise<number>;
}) {
  const [count, setCount] = useState(initialCount);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const interval = setInterval(async () => {
      try {
        const next = await action();
        if (cancelled) return;
        setCount((prev) => {
          if (next !== prev) {
            setPulse(true);
            setTimeout(() => setPulse(false), 600);
          }
          return next;
        });
      } catch {
        // כשל חד-פעמי ב-polling — פשוט ננסה שוב בסיבוב הבא, בלי להציג שגיאה.
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- action יציב, רוצים interval יחיד לאורך חיי הקומפוננטה
  }, []);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
      <div>
        <div
          className={`text-3xl font-bold text-emerald-900 transition-transform ${pulse ? "scale-110" : "scale-100"}`}
        >
          {count}
        </div>
        <div className="text-sm text-emerald-700">כניסות היום · מתעדכן אוטומטית</div>
      </div>
    </div>
  );
}
