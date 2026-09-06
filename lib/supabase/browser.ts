import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

/**
 * לקוח Supabase לדפדפן — נועד אך ורק לעמוד /admin/login (התחברות עם אימייל/סיסמה).
 * משתמש במפתח הפומבי (publishable) בלבד. אין להשתמש בו לקריאת/כתיבת נתוני אפליקציה —
 * כל נתוני האפליקציה נגישים רק דרך קוד שרת.
 */
export function createSupabaseBrowserClient() {
  const { url, key } = getPublicEnv();
  return createBrowserClient(url, key);
}
