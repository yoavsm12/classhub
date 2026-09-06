import { z } from "zod";

/**
 * כל משתני הסביבה הנדרשים לאפליקציה, מאומתים פעם אחת בעת האתחול.
 * אם חסר משתנה קריטי בזמן ריצה בשרת, נזרקת שגיאה ברורה במקום כשל שקט מאוחר יותר.
 */
const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: "NEXT_PUBLIC_SUPABASE_URL חייב להיות URL תקין של פרויקט Supabase",
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "חסר NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  SUPABASE_SECRET_KEY: z.string().min(1, "חסר SUPABASE_SECRET_KEY"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL חייב להיות כתובת אימייל תקינה"),
  GUEST_ACCESS_CODE_HASH: z.string().min(1, "חסר GUEST_ACCESS_CODE_HASH"),
  GUEST_SESSION_SECRET: z.string().min(16, "GUEST_SESSION_SECRET חייב להיות באורך 16 תווים לפחות"),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/**
 * מחזיר את משתני הסביבה הצד־שרת, לאחר אימות.
 * יש לקרוא לפונקציה זו רק מקוד שרת (Server Components, Server Actions, Route Handlers).
 */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    GUEST_ACCESS_CODE_HASH: process.env.GUEST_ACCESS_CODE_HASH,
    GUEST_SESSION_SECRET: process.env.GUEST_SESSION_SECRET,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(
      `משתני סביבה חסרים או שגויים. ודא שקובץ .env.local קיים ותקין (ראה .env.example):\n${issues}`
    );
  }

  cached = parsed.data;
  return cached;
}

/** משתני סביבה ציבוריים (מותר לחשוף לדפדפן). */
export function getPublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "חסרים NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ראה .env.example."
    );
  }
  return { url, key };
}
