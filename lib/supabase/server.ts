import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

/**
 * לקוח Supabase לצד שרת, לצורך אימות Admin בלבד (Supabase Auth session).
 * קורא/כותב עוגיות session דרך next/headers. משתמש במפתח הפומבי בלבד —
 * הרשאות המנהל לא נובעות מהמפתח אלא מבדיקת האימייל מול ADMIN_EMAIL (ראה lib/auth/admin.ts).
 *
 * יש לקרוא לפונקציה זו מחדש בכל בקשה (לא לשמור מופע גלובלי) כי היא תלויה בעוגיות הבקשה הנוכחית.
 */
export async function createSupabaseServerClient() {
  const env = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // נקרא מתוך Server Component ללא אפשרות לכתוב עוגיות — מתעלמים,
          // ה-proxy מרענן את ה-session במקרה כזה.
        }
      },
    },
  });
}
