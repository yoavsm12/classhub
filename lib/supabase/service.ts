import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

/**
 * לקוח Supabase בעל הרשאות מלאות (SUPABASE_SECRET_KEY, עוקף RLS).
 *
 * ⚠️ שרת בלבד. חבילת "server-only" תגרום לשגיאת build אם קובץ זה ייובא בטעות
 * לקוד שמגיע לדפדפן. כל הגישה לנתוני האפליקציה (מקצועות/חומרים/אירועים/הודעות/דיווחים)
 * עוברת דרך לקוח זה מתוך Server Components / Server Actions / Route Handlers בלבד —
 * הדפדפן (כולל תלמידים) אינו מדבר עם Supabase ישירות, ולכן RLS על הטבלאות נשאר "deny all"
 * כהגנת עומק בלבד.
 *
 * ה-generic <any> כאן מכוון: הפרויקט לא כולל (עדיין) טיפוסי Database מיוצרים
 * (supabase gen types). בלעדיו TypeScript מטיל את פעולות ה-insert/update ל-never.
 * ראו lib/types.ts לטיפוסי הדומיין הידניים שמשמשים בפועל בשכבת lib/data/*.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- אין טיפוסי Database מיוצרים, ראו הערה למעלה
let cachedClient: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseServiceClient() {
  if (cachedClient) return cachedClient;
  const env = getServerEnv();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- אין טיפוסי Database מיוצרים, ראו הערה למעלה
  cachedClient = createClient<any>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cachedClient;
}
