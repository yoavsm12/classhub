import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/env";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * מחזיר את פרטי המנהל אם המשתמש מחובר ואימיילו תואם בדיוק ל-ADMIN_EMAIL, אחרת null.
 * זו נקודת האמת היחידה לזיהוי הרשאת Admin באפליקציה — אין להסתמך על מצב ה-UI.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const env = getServerEnv();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;
  if (user.email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) return null;

  return { id: user.id, email: user.email };
}

/**
 * שומר Server Component / Server Action של Admin: מחזיר את משתמש המנהל,
 * ואם אין הרשאה — מפנה מיד ל-/admin/login (עוצר את הריצה).
 * יש לקרוא לפונקציה זו בראש כל action/page של ניהול, גם אם ה-proxy כבר סינן חלק מהמקרים.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
